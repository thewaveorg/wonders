#include <napi.h>
#include <windows.h>
#include <iostream>
#include <iterator>
#include <list>


using namespace std;

list<HWND> handledWindows;

// Utilities
template <typename T>
bool l_contains(list<T> & elist, const T & el)
{
    auto it = find(elist.begin(), elist.end(), el);

    // Return if iterator points to end or not.
    // It points to end then it means element does not exists in list

    return it != elist.end();
}

/*
template <typename T>
pair<bool, list<HWND>::iterator> l_find(list<T> & elist, const T & el)
{
    list<HWND>::iterator it = find(elist.begin(), elist.end(), el);

    pair<bool, T> res = { it != elist.end, it }
    return res;
}
*/

// WINAPI related functions.
/// Windows Message Loop (events)
void StartMessageLoop() 
{
    // Run the message loop.

    MSG msg = { };
    while (GetMessage(&msg, NULL, 0, 0))
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    return;
}

/// Window event handler, we only care about WM_WINDOWPOSCHANGING.
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    switch (uMsg)
    {
    case WM_WINDOWPOSCHANGING:
        {
            WINDOWPOS* pos = (WINDOWPOS*)lParam;

            // If changed window is being handled, then move back.
            if (!l_contains(handledWindows, pos->hwnd))
                return 0;
            
            // Show desktop (Windows + D) results in the window moved to -32000, -32000 and size changed
            if (pos->x == -32000) {
                // Set the flags to prevent this and "survive" to the desktop toggle
                pos->flags |= SWP_NOMOVE | SWP_NOSIZE;
            }
            // Also force the z order to ensure the window is always on bottom
            pos->hwndInsertAfter = HWND_BOTTOM;
            return 0;
        }
        break;
    }

    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}

// Window Managing
HWND ConvertHandle(Napi::Buffer<void *> hwndHandle) {
    return static_cast<HWND>(*reinterpret_cast<void **>(hwndHandle.Data()));
}

void HandleWindow(Napi::Buffer<void *> hwndHandle) {
    HWND win = ConvertHandle(hwndHandle);

    handledWindows.push_back(win);
    SetWindowPos(win, HWND_BOTTOM, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOZORDER);
}

void ReleaseWindow(Napi::Buffer<void *> hwndHandle) {
    HWND win = ConvertHandle(hwndHandle);

    handledWindows.remove(win);
}

// Node Addon API
static void Initialize(const Napi::CallbackInfo &info)
{
    StartMessageLoop();
}

/// What I understood is that exported functions must take a Napi::CallbackInfo
/// and what I did earlier was try to take the info's data, convert it to a buffer and
/// then work with it, that's why there are duplicates; they should, in theory, 
/// convert the data before sending to the actual function.
void HandleWindowExpose(const Napi::CallbackInfo &info)
{
    if (info[0].IsBuffer()) {
       HandleWindow(info[0].As<Napi::Buffer<void*>>());
    }
}

void ReleaseWindowExpose(const Napi::CallbackInfo &info)
{
    if (info[0].IsBuffer()) {
       ReleaseWindow(info[0].As<Napi::Buffer<void*>>());
    }
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    // methods here
    exports.Set(Napi::String::New(env, "Initialize"),
                Napi::Function::New(env, Initialize));

    exports.Set(Napi::String::New(env, "HandleWindow"),
                Napi::Function::New(env, HandleWindow));

    exports.Set(Napi::String::New(env, "ReleaseWindow"),
                Napi::Function::New(env, ReleaseWindow));

    return exports;
}

NODE_API_MODULE(addon, InitAll)