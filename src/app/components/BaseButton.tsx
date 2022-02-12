import React, { ButtonHTMLAttributes } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import styled from 'styled-components';

/* Styles */
const StyledButton = styled(motion.button)`
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

  &:focus {
      outline: none;
  }
`;

/* Main Component */
interface IBaseButton extends HTMLMotionProps<"button"> { }

export const BaseButton: React.FC<IBaseButton> = (props) => {
  props = { ...props };
  props.initial ??= { opacity: 0 };
  props.animate ??= { opacity: 1 };
  props.transition ??= { duration: 0.025 };
  props.whileHover ??= { scale: 1.05 };
  props.whileTap ??= { scale: 0.95, filter: 'brightness(60%)' };
  // This disables hardware acceleration, so buttons don't get blurry.
  props.transformTemplate = ({ scale }) => `scale(${scale})`;

  return (
    <StyledButton {...props} />
  );
}