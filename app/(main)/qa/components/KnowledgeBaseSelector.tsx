import { Box, Typography, Button, FormGroup, FormControlLabel, Checkbox, Alert, Paper } from '@mui/material';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { KnowledgeBaseVO } from '@/app/types/knowledge';

interface KnowledgeBaseSelectorProps {
    knowledgeBases: KnowledgeBaseVO[];
    selectedKbs: number[];
    onSelectAll: () => void;
    onSelectKb: (id: number, checked: boolean) => void;
}

export const KnowledgeBaseSelector = ({
    knowledgeBases,
    selectedKbs,
    onSelectAll,
    onSelectKb,
}: KnowledgeBaseSelectorProps) => {
    const { t } = useTranslation();

    return (
        <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {t('qa.selectKb')}:
                </Typography>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={selectedKbs.length === knowledgeBases.length ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                    onClick={onSelectAll}
                >
                    {t('qa.selectAll')}
                </Button>
            </Box>

            <FormGroup row sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                '& .MuiFormControlLabel-root': {
                    margin: 0
                }
            }}>
                {knowledgeBases.map((kb) => (
                    <FormControlLabel
                        key={kb.id}
                        control={
                            <Checkbox
                                checked={selectedKbs.includes(kb.id)}
                                onChange={(e) => onSelectKb(kb.id, e.target.checked)}
                                size="small"
                            />
                        }
                        label={kb.name}
                        sx={{
                            '& .MuiTypography-root': {
                                fontSize: '0.875rem'
                            }
                        }}
                    />
                ))}
            </FormGroup>

            {selectedKbs.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    {t('qa.noKbSelected')}
                </Alert>
            )}
        </Paper>
    );
}; 