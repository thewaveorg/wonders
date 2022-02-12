import React from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import styled from 'styled-components';

/* Styles */
const AnimationContainerStyle = styled(motion.div)`
    height: fit-content;
    width: fit-content;
`;

/* Main Component */
interface IAnimationContainer extends HTMLMotionProps<"div"> { }

export const AnimationContainer: React.FC<IAnimationContainer> = (props) => {
    props = { ...props };
    props.initial ??= { opacity: 0, y: 50 };
    props.animate ??= { opacity: 1, y: 0 };
    props.transition ??= { duration: .5 };

    return (
        <AnimationContainerStyle {...props}>

        </AnimationContainerStyle>
    );
};