import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextContainer = styled.div`
  flex: 1;
  max-width: 70%;
`;

const ImageContainer = styled.div`
  margin-left: 20px;
`;

const ProblemText = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

const ProblemImage = styled.img`
  max-width: 200px; /* Adjust the maximum width of the image */
  max-height: 200px; /* Adjust the maximum height of the image */
`;

const ProblemDisplayer = ({ text, imageUrl }) => {
  return (
    <Container>
      <TextContainer>
        <ProblemText>{text}</ProblemText>
      </TextContainer>
      {imageUrl && (
        <ImageContainer>
          <ProblemImage src={imageUrl} alt="Problem Image" />
        </ImageContainer>
      )}
    </Container>
  );
};

export default ProblemDisplayer;
