import {ReactNode} from "react";
import {createPortal} from "react-dom";
import {PORTAL_CONTAINER_NODE_ID} from "../../constants.ts";

type Props = {
    children: ReactNode
};

export const Portal = (props: Props) => {
    const {children} = props;

    return createPortal(children, document.getElementById(PORTAL_CONTAINER_NODE_ID)!);
};