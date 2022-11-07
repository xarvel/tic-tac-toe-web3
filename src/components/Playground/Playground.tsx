import React, {FC, useCallback} from "react";
import {Mark, PlaygroundData as PlaygroundType} from '../../store/playgroundData';
import {MarkFigure} from "../../store/markFigure";
import {IconO} from "../../icons/IconO";
import {IconX} from "../../icons/IconX";
import './style.css';

type PlaygroundProps = {
    playground: PlaygroundType
    markFigure: MarkFigure,
    onMove: (row: number, col: number) => void
    disabled: boolean;
}

export const Playground:FC<PlaygroundProps> = ({ playground, markFigure, onMove, disabled }) => {
    const handleMakeMove = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const row = event.currentTarget.getAttribute('data-row');
        const col = event.currentTarget.getAttribute('data-col');

        if(row && col){
            onMove( parseInt(row), parseInt(col))
        }
    },[]);


    const renderSquare = (rowIndex: number, colIndex: number, item: any) => {
        if (item !== Mark.EMPTY){
            if(item === Mark.YOUR){
                return markFigure === MarkFigure.NOUGHT ? <IconO sx={{color: 'darkorange',  stroke: 'darkorange', height: '100%', width: '100%' }}/> : <IconX  sx={{ color: 'darkorange', fill: "darkorange", stroke: 'darkorange', height: '100%', width: '100%' }} />
            }else {
                return markFigure === MarkFigure.NOUGHT ? <IconX  sx={{ color: '#ffffff', fill: "#ffffff", stroke: '#ffffff', height: '100%', width: '100%' }} /> : <IconO sx={{ color: '#ffffff', fill: "#ffffff", stroke: '#ffffff', height: '100%', width: '100%' }}/>
            }
        }
    }

    return (
        <div className='playground'>
            {playground.map((cols, rowIndex) => cols.map((item, colIndex) => <button onClick={handleMakeMove} disabled={item !== Mark.EMPTY || disabled} data-row={rowIndex} data-col={colIndex} className='playground__item' key={`${rowIndex}-${colIndex}`}>
                    {renderSquare(rowIndex, colIndex, item)}
                </button>
            ))}
        </div>
    )
}
