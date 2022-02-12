#include <napi.h>
#include <windows.h>
#include <thread>
#include <iostream>
#include <iterator>
#include <list>

using namespace std;

list<HWND> handledWindows;

// Utilities
void fmt_output(string message) {
    cout << ("[Windows Native Manager] " + message + "\n");
}

template <typename T>
bool l_contains(list<T> & elist, const T & el)
{
    auto it = find(elist.begin(), elist.end(), el);

    // Return if iterator points to end or not.
    // It points to end then it means element does not exists in list

    return it != elist.end();
}

// WINAPI related functions.
VOID CALLBACK WinEventProcCallback(HWINEVENTHOOK hWinEventHook, DWORD dwEvent, HWND hwnd, LONG idObject, LONG idChild, DWORD dwEventThread, DWORD dwmsEventTime)
{
    switch (dwEvent) 
    {
        case EVENT_OBJECT_LOCATIONCHANGE:
        case EVENT_SYSTEM_MOVESIZESTART:
        case EVENT_SYSTEM_MOVESIZEEND:
        case EVENT_OBJECT_REORDER:
        {
            //fmt_output("Detected window movement.");
            if (l_contains(handledWindows, hwnd)) // seems like it's not working. at least we can detect all events now.
            {
                fmt_output("Window changed is being handled.");
                for (const auto& win : handledWindows) {
                    SetWindowPos(win, HWND_BOTTOM, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);
                }
                
            }
        }
        break;
    }
}

HWINEVENTHOOK hEvent = SetWinEventHook(
    EVENT_MIN, EVENT_MAX, NULL, WinEventProcCallback,
    0, 0, WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS
);

// Window Managing
HWND ConvertHandle(Napi::Buffer<void *> hwndHandle) {
    return static_cast<HWND>(*reinterpret_cast<void **>(hwndHandle.Data()));
}

void HandleWindow(Napi::Buffer<void *> hwndHandle) {
    HWND win = ConvertHandle(hwndHandle);

    handledWindows.push_back(win);
    SetParent(win, GetDesktopWindow());
    SetWindowPos(win, HWND_BOTTOM, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOZORDER);

    fmt_output("Valid HandleWindow() call for " + hwndHandle.ToString().Utf8Value());
    fmt_output("Currently handling " + to_string(static_cast<int>(handledWindows.size())) + " windows.\n");
}

void ReleaseWindow(Napi::Buffer<void *> hwndHandle) {
    HWND win = ConvertHandle(hwndHandle);

    handledWindows.remove(win);
    fmt_output("Valid ReleaseWindow() call for " + hwndHandle.ToString().Utf8Value());
    fmt_output("Currently handling " + to_string(static_cast<int>(handledWindows.size())) + " windows.\n");
}

// Node Addon API
void Initialize(const Napi::CallbackInfo &info)
{
    fmt_output("Initialized. Starting Windows message loop asynchronously.");
}

/// What I understood is that exported functions must take a Napi::CallbackInfo
/// and what I did earlier was try to take the info's data, convert it to a buffer and
/// then work with it, that's why there are duplicates; they should, in theory, 
/// convert the data before sending to the actual function.
void HandleWindowWrapper(const Napi::CallbackInfo &info)
{
    fmt_output("Called HandleWindow.");
    if (info[0].IsBuffer()) {
       HandleWindow(info[0].As<Napi::Buffer<void*>>());
    }
}

void ReleaseWindowWrapper(const Napi::CallbackInfo &info)
{
    fmt_output("Called ReleaseWindow.");
    if (info[0].IsBuffer()) {
       ReleaseWindow(info[0].As<Napi::Buffer<void*>>());
    }
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "Initialize"),
                Napi::Function::New(env, Initialize));

    exports.Set(Napi::String::New(env, "HandleWindow"),
                Napi::Function::New(env, HandleWindowWrapper));

    exports.Set(Napi::String::New(env, "ReleaseWindow"),
                Napi::Function::New(env, ReleaseWindowWrapper));

    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll);