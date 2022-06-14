import styled from 'styled-components';

export const MainHeaderContainer = styled.div`
    display: inline-flex;
    flex-direction: row;
    align-items: baseline;
    padding: 0 15rem 0 15rem;
    justify-content: space-between;
`;

export const MainHeaderButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        :not(:last-child) {
            margin: 0 0 1rem 0;
        }
    }
`;

export const HeadingDivider = styled.div`
    display: flex;
    align-items: center;

    > * {
        &:first-child {
            margin-right: 3rem;
        }
    }
`;
export const MainContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    box-sizing: border-box;
    background-color: #ffffff;
    padding: 0 15rem 0 15rem;
`;
export const FooterContainer = styled.div`
    display: flex;
    flex-direction: row;
    min-height: 4rem;

    border-style: solid;
    border-width: 0.2rem 0 0 0;
    border-color: #499cc6;
    background-color: #e2f1fe;
    padding: 0.8rem;
    align-items: center;
`;
export const FooterLeftContainer = styled.div`
    width: 20rem;
    display: flex;
    flex-direction: column;
    padding: 0.8rem;
    align-items: start;
    justify-content: center;
    & > button {
        margin: 0.2rem;
        background-color: white;
        width: 10rem;
        justify-content: center;
    }
`;
export const FooterRightContainer = styled.div`
    align-items: center;
    justify-content: center;
    & :first-child {
        margin-right: 2em;
        background-color: white;
    }
    & > button {
        width: 10rem;
        justify-content: center;
    }
`;
export const SelectContainer = styled.div`
    width: 8rem;
`;
