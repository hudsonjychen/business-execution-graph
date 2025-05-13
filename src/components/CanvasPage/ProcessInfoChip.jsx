import { Typography } from '@mui/material'
import './ProcessInfoChip.css'
import { useFilter } from "../FilterContext";
import { objectTypeFilter } from './Interaction'

export default function ProcessInfoChip({ elements, knowledge, objects }) {
    const { objectTypeChecked } = useFilter();
    let processCount = 0, objectTypeCount = 0, objectCount = 0;

    if(elements){
        const filteredElements = objectTypeFilter(elements, objectTypeChecked);

        filteredElements.forEach(element => {
            if(element['data']['label']){
                processCount += 1;
            }
        });

        knowledge.forEach(element => {
            if(element['data']['category'] === 'object_type' && objectTypeChecked.includes(element['data']['label'])){
                objectTypeCount += 1;
            }
        });

        Object.entries(objects).forEach(([obj, type]) => {
            if (objectTypeChecked.includes(type)) {
                objectCount += 1;
            }
        });
    }

    return (
        <div className="process-info-chip">
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                Process count: {processCount}, Object type count: {objectTypeCount}, Object count: {objectCount}
            </Typography>
        </div>
    )
}