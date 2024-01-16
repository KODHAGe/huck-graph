import React, { CSSProperties } from 'react';

import { useCSVReader } from 'react-papaparse';

import { tidy, count } from '@tidyjs/tidy'

import './csvUploader.css'

const styles = {
    progressBarBackgroundColor: {
        backgroundColor: 'rgb(83, 63, 102)',
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
                    <div className="csvUploader" style={styles.csvReader}>
                        <button className="addbutton" type='button' {...getRootProps()} style={styles.browseFile}>
                            Choose file
                        </button>
                        { acceptedFile &&
                            <div className="acceptedfile" style={styles.acceptedFile}>
                                {acceptedFile && acceptedFile.name}
                            </div>
                        }
                        { acceptedFile &&
                            <a className="removebutton" {...getRemoveFileProps()} style={styles.remove}>
                                Remove file
                            </a>
                        }
                    </div>
                    <ProgressBar style={styles.progressBarBackgroundColor} />
                </>
            )}
        </CSVReader>
    );
}