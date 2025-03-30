import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Document, DocumentCreateDTO } from "@/app/types/document";
import { useDocumentData } from "@/app/(main)/documents/hooks/useDocumentData";
import { CommonButton } from "@/app/components/common/CommonButton";
import { CommonSelect } from "@/app/components/common/CommonSelect";
import { CommonInput } from "@/app/components/common/CommonInput";

interface DocumentDialogProps {
  open: boolean;
  onClose: () => void;
  editingDocument: Document | null;
  formData: DocumentCreateDTO;
  setFormData: (data: DocumentCreateDTO) => void;
  onSubmit: () => void;
}

export const DocumentDialog: React.FC<DocumentDialogProps> = ({
  open,
  onClose,
  editingDocument,
  formData,
  setFormData,
  onSubmit,
}) => {
  if (!open) return null;
  const { categories, tags, knowledgeBases } = useDocumentData();
  const { t } = useTranslation();

  const handleFormDataChange = (field: keyof DocumentCreateDTO, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingDocument
          ? t("documents.editDocument")
          : t("documents.createDocument")}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <CommonInput
            label={t("common.name")}
            value={formData.title}
            onChange={(value) => handleFormDataChange("title", value as string)}
            error={!formData.title}
            helperText={!formData.title ? t("documents.nameRequired") : ""}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "60px",
              },
            }}
          />

          <CommonSelect
            label={t("documents.selectKb")}
            value={formData.kbId || ""}
            onChange={(value) =>handleFormDataChange("kbId", value as number)}
            options={knowledgeBases.map((kb) => ({ id: kb.id, name: kb.name }))}
          />

          <CommonSelect
            fullWidth
            label={t("documents.category")}
            value={formData.categoryId || ""}
            onChange={(value) =>handleFormDataChange("categoryId", value as number)}
            options={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
          />
          <CommonSelect
            fullWidth
            multiple
            label={t("documents.tags")}
            value={formData.tagIds || []}
            onChange={(value) =>
              handleFormDataChange("tagIds", value as string[])
            }
            options={tags.map((cat) => ({ id: cat.id, name: cat.name }))}
          />

          <CommonInput
            label={t("documents.content")}
            value={formData.content}
            onChange={(value) =>
              handleFormDataChange("content", value as string)
            }
            error={!formData.title}
            multiline
            rows={20}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <CommonButton buttonVariant="cancel" onClick={onClose}>
          {t("common.cancel")}
        </CommonButton>

        <CommonButton
          onClick={onSubmit}
          buttonVariant="submit"
          disabled={!formData.title}
        >
          {t("common.submit")}
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
};
