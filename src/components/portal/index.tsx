import {memo, ReactNode, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';

interface IPortalProps {
    children: ReactNode,
    isOpen?: boolean,
    className?: string,
    container?: Element | DocumentFragment
}

const PortalComponent = ({
                             isOpen = false,
                             children,
                             className,
                             container: propsContainer,
                         }: IPortalProps) => {
    const [container, setContainer] = useState(propsContainer);

    useEffect(() => {
        if (!propsContainer) {
            const div = document.createElement('div');
            if (className) {
                div.className = className;
            }

            setContainer(div);

            document.body.appendChild(div);
            return () => {
                document.body.removeChild(div);
            };
        }
    }, [className, propsContainer]);

    return isOpen && container ? createPortal(children, container) : null;
}

export const Portal = memo(PortalComponent);