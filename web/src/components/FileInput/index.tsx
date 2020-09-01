import React, { FC, useEffect, useState } from 'react'
import './index.scss'

import AttachFileIcon from '@material-ui/icons/AttachFile';
import ImageIcon from '@material-ui/icons/Image';

type FileInputFormats = | 'images' | 'any';

interface FileInputProps {
    format?: FileInputFormats
    onSelection?: (e: FileList) => void
    multiple?: boolean
}

const FileInput: FC<FileInputProps> = ({ format, onSelection, multiple = false }) => {
    const [formatString, setFormatString] = useState<string>('');

    useEffect(() => {
        switch(format) {
            case 'images':
                setFormatString('image/png, image/jpeg');
        }
    }, []);

    const handleChange = (files: FileList | null) => {
        onSelection && files && onSelection(files);
    }

    return (
        <>
        <input type="file" id="files" className="file-input" accept={formatString} onChange={(e) => handleChange(e.target.files)} multiple={multiple} />
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
