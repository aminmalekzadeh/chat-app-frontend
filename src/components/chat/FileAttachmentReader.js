import { useContext } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Typography, CircularProgress } from '@mui/material';
import { fDateTime } from '../../utils/formatTime';
import { getFileFullName, getFileThumb } from '../../utils/getFileFormat';
import { ChatContext } from "../../contexts/ChatContext";



const FileItemStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    paddingRight: 20,
    paddingLeft: 3
}));

const FileThumbStyle = styled('div')(({ theme }) => ({
    width: 40,
    height: 40,
    flexShrink: 0,
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[500_16]
}));

AttachmentItem.propTypes = {
    file: PropTypes.object,
    fileUrl: PropTypes.string,
    downloadUrl: PropTypes.string,
    itemId: PropTypes.string
};

AttachmentItem.defaultProps = {
    downloadUrl: null
}

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

CircularProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

function AttachmentItem({ file, fileUrl, downloadUrl }) {

    const chat = useContext(ChatContext);
   // let ProcessNode = null;
    // if (File !== []) {
    //     console.log('File[itemId]',File)
    //     if (File[itemId] !== undefined) {
           
    //         ProcessNode = <Box sx={{ ml: 2, maxWidth: 20 }}>
    //             <CircularProgressWithLabel value={File[itemId]} />
    //         </Box>
    //     }

    // }

    return (
        <FileItemStyle key={fileUrl}>
            <FileThumbStyle>{getFileThumb(fileUrl)}</FileThumbStyle>
            <Box sx={{ ml: 1.5, maxWidth: 150 }}>
                <Typography sx={{ color: 'text.secondary', display: 'block' }} variant="body2" noWrap>
                    <a href={downloadUrl !== null ? downloadUrl : '#'} target="_blank" rel="noreferrer">
                        {getFileFullName(fileUrl)}
                    </a>
                </Typography>
                <Typography noWrap variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    {fDateTime(file.lastModified)}
                </Typography>
            </Box>
            
        </FileItemStyle>
    );
}

export default AttachmentItem;