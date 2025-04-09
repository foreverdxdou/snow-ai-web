import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box, Stack, Divider } from "@mui/material";
import type { KbCategory } from "@/app/types/category";
import type { KnowledgeBaseVO } from "@/app/types/knowledge";
import type { DocumentSearchParams } from "@/app/types/document";
import { SearchBar } from "@/app/components/common/SearchBar";
import { CommonInput } from "@/app/components/common/CommonInput";
import { CommonSelect } from "@/app/components/common/CommonSelect";
import { CommonButton } from "@/app/components/common/CommonButton";
import { useRouter, useSearchParams } from "next/navigation";

interface DocumentSearchBarProps {
  params: DocumentSearchParams;
  setParams: (params: DocumentSearchParams) => void;
  refresh: () => void;
  onUploadClick: () => void;
  categories: KbCategory[];
  knowledgeBases: KnowledgeBaseVO[];
}

export const DocumentSearchBar: React.FC<DocumentSearchBarProps> = ({
  params,
  setParams,
  onUploadClick,
  categories,
  knowledgeBases,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchName, setSearchName] = useState(params.title || "");

  // 处理搜索名称变化
  const handleSearchNameChange = useCallback(
    (value: string) => {
      setSearchName(value);
      setParams({
        ...params,
        current: 1,
        title: value || undefined,
      });
    },
    [params, setParams]
  );

  // 处理分类变化
  const handleCategoryChange = useCallback(
    (value: string | number) => {
      setParams({
        ...params,
        current: 1,
        categoryId: (value as number) || undefined,
      });
    },
    [params, setParams]
  );

  // 处理知识库变化
  const handleKbChange = useCallback(
    (value: string) => {
      setParams({
        ...params,
        current: 1,
        kbId: value || undefined,
      });
    },
    [params, setParams]
  );

  // 处理重置
  const handleReset = useCallback(() => {
    setSearchName("");
    setParams({
      current: 1,
      size: params.size,
      title: undefined,
      categoryId: undefined,
      kbId: undefined,
      status: undefined,
    });
    // 清除 URL 参数
    router.push('/documents');
  }, [params.size, setParams, router]);
  
  // 处理搜索
  const handleSearch = useCallback(() => {
    // 使用当前的搜索参数触发搜索
    setParams({
      ...params,
      current: 1, // 重置到第一页
    });
  }, [params, setParams]);

  return (
    <Box sx={{ mb: 2 }}>
      <SearchBar>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ width: "100%" }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flex: 1,
              flexWrap: "wrap",
              minWidth: 0,
            }}
          >
            <CommonInput
              label={t("documents.searchByName")}
              value={searchName}
              onChange={(value) => handleSearchNameChange(value as string)}
              sx={{ width: { xs: "100%", sm: 150 } }}
            />

            <CommonSelect
              label={t("documents.searchByCategory")}
              value={params.categoryId}
              onChange={(value) => handleCategoryChange(value as number)}
              options={categories.map((cat) => ({
                id: cat.id,
                name: cat.name,
              }))}
              sx={{ width: { xs: "100%", sm: 150 } }}
            />

            <CommonSelect
              label={t("documents.searchByKb")}
              value={params.kbId}
              onChange={(value) => handleKbChange(value as string)}
              options={knowledgeBases.map((kb) => ({
                id: kb.id,
                name: kb.name,
              }))}
              sx={{ width: { xs: "100%", sm: 150 } }}
            />

            <CommonSelect
              label={t("documents.searchByStatus")}
              value={params.status}
              onChange={(value) => setParams({ ...params, status: value as number })}
              options={[
                { id: 1, name: t("documents.enabled") },
                { id: 0, name: t("documents.disabled") },
              ]}
              sx={{ width: { xs: "100%", sm: 150 } }}
            />
             <CommonButton
              buttonVariant="search"
              onClick={handleSearch}
              sx={{
                flex: { xs: 1, sm: "0 0 auto" },
                minWidth: { sm: 50 },
              }}
            >
              {t("common.search")}
            </CommonButton>
            <CommonButton
              buttonVariant="reset"
              onClick={handleReset}
              sx={{
                flex: { xs: 1, sm: "0 0 auto" },
                minWidth: { sm: 50 },
              }}
            >
              {t("documents.resetButton")}
            </CommonButton>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: "none", sm: "block" },
              mx: 0.5,
              borderColor: "divider",
            }}
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{
              flex: { xs: "0 0 auto", sm: "0 0 auto" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <CommonButton
              buttonVariant="upload"
              onClick={onUploadClick}
              icon
              sx={{
                flex: { xs: 1, sm: "0 0 auto" },
                minWidth: { sm: 100 },
              }}
            >
              {t("documents.uploadDocument")}
            </CommonButton>
          </Stack>
        </Stack>
      </SearchBar>
    </Box>
  );
};
