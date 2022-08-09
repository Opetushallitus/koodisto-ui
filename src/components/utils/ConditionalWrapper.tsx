import React, { ReactNode } from 'react';

export const ConditionalWrapper: React.FC<{
    condition: boolean;
    wrapper: (children?: ReactNode) => ReactNode;
}> = ({ condition, wrapper, children }) => (condition ? <>{wrapper(children)}</> : <>{children}</>);
