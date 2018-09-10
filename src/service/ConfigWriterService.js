'use strict';

import ConfigWriter from 'ConfigWriter/build/ConfigJSONFileWriter';



class ConfigWriterService {
    constructor() {
        this.writers = {}
    }

    getFileWriter = (filePath, allowedFields) =>{
        if(filePath in this.writers){
            return this.writers[filePath];
        }else{
            let configWriter = new ConfigWriter(filePath, allowedFields);
            this.writers[filePath] = configWriter;
            return configWriter;
        }
    }
}

const configWriterService = new ConfigWriterService();
export default configWriterService;
