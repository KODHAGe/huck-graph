import React, { CSSProperties } from 'react';

import { useCSVReader } from 'react-papaparse';

import { tidy, count } from '@tidyjs/tidy'

const styles = {
    csvReader: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
    },
    browseFile: {
        width: '20%',
    },
    acceptedFile: {
        border: '1px solid #ccc',
        height: 45,
        lineHeight: 2.5,
        paddingLeft: 10,
        width: '80%',
    },
    remove: {
        borderRadius: 0,
        padding: '0 20px',
    },
    progressBarBackgroundColor: {
        backgroundColor: 'red',
    },
};

export default function CSVReader({updateCsvData}) {
    const { CSVReader } = useCSVReader();

    return (
        <CSVReader
            config={{
                header: true,
                worker: true
            }}
            onUploadAccepted={(results) => {
                console.log('csv data get')
                updateCsvData(results.data)
                console.log('---------------------------');
            }}
        >
            {({
                getRootProps,
                acceptedFile,
                ProgressBar,
                getRemoveFileProps,
            }) => (
                <>
                    <div style={styles.csvReader}>
                        <button type='button' {...getRootProps()} style={styles.browseFile}>
                            Browse file
                        </button>
                        <div style={styles.acceptedFile}>
                            {acceptedFile && acceptedFile.name}
                        </div>
                        <button {...getRemoveFileProps()} style={styles.remove}>
                            Remove
                        </button>
                    </div>
                    <ProgressBar style={styles.progressBarBackgroundColor} />
                </>
            )}
        </CSVReader>
    );
}