import React, { FC, useEffect, useState } from 'react'
import './index.scss'

import AttachFileIcon from '@material-ui/icons/AttachFile';
import ImageIcon from '@material-ui/icons/Image';

type FileInputFormats = | 'images' | 'any';

interface FileInputProps {
    format?: FileInputFormats
}

const FileInput: FC<FileInputProps> = ({ format }) => {
    const [formatString, setFormatString] = useState<string>('');

    useEffect(() => {
        switch(format) {
            case 'images':
                setFormatString('image/png, image/jpeg');
        }
    }, []);

    return (
        <>
        <input type="file" id="files" className="file-input" accept={formatString} />
        <label htmlFor="files">
            { format === 'images' ? (
                <ImageIcon>Filled</ImageIcon>
            ) : null }
            { format === 'any' ? (
                <AttachFileIcon>Filled</AttachFileIcon>
            ) : null }
        </label>
        </>
    )
}

export default FileInput
