import {memo, useEffect, useMemo, useRef, useState,} from 'react';
import {createPortal} from "react-dom";
import {
    borderSizes,
    centralIndex,
    convertInto2DMatrix,
    defaultColors,
    getColorsMatrix,
    matrixBasis,
    offset,
} from './utils.ts';
import {PORTAL_CONTAINER_NODE_ID} from "../../constants.ts";
import styles from './styles.module.css'

export interface IDropperProps {
    context?: HTMLCanvasElement | null;
    onChange?: (color: string, fromDropper: boolean, event: Event) => void;
    open?: boolean;
}

const MagnifierComponent = ({context, onChange}: IDropperProps) => {
    const [topLeft, setTopLeft] = useState([0, 0]);
    const [colors, setColors] = useState(defaultColors);
    const [top, left] = topLeft;
    const [isVisible, setIsVisible] = useState(false);
    const centralColorRef = useRef('');
    const {matrixRepresantationData, clientRect} = useMemo(() => {
        if (context) {
            const ctx = context?.getContext('2d') as CanvasRenderingContext2D;
            const clientRect = context.getBoundingClientRect();
            const imageData = ctx.getImageData(0, 0, context.width, context.height).data;
            const matrixRepresantationData = convertInto2DMatrix(imageData, context.width * 4);
            return {
                clientRect,
                matrixRepresantationData,
            };
        }
        return {};
    }, [context]);
    centralColorRef.current = colors[centralIndex][centralIndex];

    const
        overlay = '',
        overlayWrapper = '',
        // overlaySquare = '',
        // borderRequired = '',
        hexLabel = '',
        hexValue = '';


    useEffect(() => {
        if (!context || !clientRect || !matrixRepresantationData) {
            return
        }
        const onMouseMove = (event: MouseEvent) => {
            const {
                top: boundTop,
                left: boundLeft,
                width,
                height,
            } = clientRect;
            const widthRatio = context.width / width || 1;
            const heightRatio = context.height / height || 1;
            const {clientX, clientY} = event;
            const nextColors = getColorsMatrix(
                matrixRepresantationData,
                clientX - boundLeft,
                clientY - boundTop,
                widthRatio,
                heightRatio,
            );
            // onMouseOver and onMouseLeave works wrong, so we hide dropper when the 'clientX' biggger than 'boundLeft', same for clientY and boundTop
            if ((clientX <= boundLeft) || (clientY <= boundTop)) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setTopLeft([
                clientY - offset - borderSizes,
                clientX - offset - borderSizes,
            ]);
            setColors(nextColors);
        };
        const onMouseOver = () => {
            setIsVisible(true);
        };
        const onMouseLeave = () => {
            setIsVisible(false);
        };

        const onClick = (e: Event) => onChange ? onChange(centralColorRef.current, true, e) : null;

        context.addEventListener('mousemove', onMouseMove);
        context.addEventListener('mouseover', onMouseOver);
        context.addEventListener('mouseleave', onMouseLeave);
        context.addEventListener('click', onClick);
        return () => {
            context.removeEventListener('mousemove', onMouseMove);
            context.removeEventListener('mouseover', onMouseOver);
            context.removeEventListener('mouseleave', onMouseLeave);
            context.removeEventListener('click', onClick);
        };
    }, [context, onChange, clientRect, matrixRepresantationData]);


    return (isVisible ?
        createPortal(
            (<div className={styles.magnifier} style={{top, left}}>
                    <div
                        className={overlay}
                        style={{borderColor: colors[centralIndex][centralIndex]}}
                    >
                        {matrixBasis.map((_: number, index: number) => (
                            // eslint-disable-next-line
                            <div key={index} className={overlayWrapper}>
                                {matrixBasis.map((_: number, itemIndex: number) => {
                                    // const isBorderNeeded = needBorder(itemIndex, index);
                                    return (
                                        <div
                                            // eslint-disable-next-line
                                            key={itemIndex}
                                            style={{
                                                background: colors[index][itemIndex],
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        ))}

                        <div className={hexLabel}>
            <span className={hexValue}>
              {colors[centralIndex][centralIndex].toUpperCase()}
            </span>
                        </div>
                    </div>
                </div>
            ), document.getElementById(PORTAL_CONTAINER_NODE_ID)!
        ) : null)
}


export const Magnifier = memo(MagnifierComponent);
