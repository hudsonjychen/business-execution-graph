const calculateNodeSize = (elements, attributeTypeChecked) => {
    if(attributeTypeChecked == ''){
        return
    }
    const values = {};
    const sizes = {};
    let maxValue;
    let minValue;

    elements.forEach(element => {
        if(element['data']['label']){
            values[element['data']['id']] = element['data'][attributeTypeChecked]
        }
    });

    const allValues = Object.values(values);

    maxValue = Math.max(...allValues);
    minValue = Math.min(...allValues);

    function calculate(maxValue, minValue, value) {
        return (40 + (value - minValue) / (maxValue - minValue) * 80)
    };

    elements.forEach(element => {
        sizes[element['data']['id']] = calculate(maxValue, minValue, values[element['data']['id']]);
    });

    return sizes;
};

export default calculateNodeSize;