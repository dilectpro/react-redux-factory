export default function wrapMapStateToProps(mapStateToProps) {
    if(typeof mapStateToProps === 'function') {
        return mapStateToProps;
    };
    return null;
};