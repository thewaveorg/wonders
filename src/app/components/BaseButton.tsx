import styled from "styled-components";


export const BaseButton = styled.button`
  align-items: center;
  background: var(--different-background-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: #fff;
  display: inline-flex;
  font-family: 'Inter';
  font-size: .75em;
  font-weight: 50;
  justify-content: center;
  line-height: 1;
  padding: .5rem .75rem;
  text-align: center;
  text-decoration: none;
  transition: .07s linear;
  user-select: none;
  vertical-align: middle;
  margin: 0 1rem 0 0;

  &:active {
      filter: brightness(60%);
  }

  &:focus {
      outline: none;
  }
`;