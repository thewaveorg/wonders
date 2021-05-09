import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Page = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow-y: scroll;
`;
