"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useVirtualizer } from "@tanstack/react-virtual";

interface PerformanceTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    title: string | React.ReactNode;
    width?: number;
    render?: (value: any, record: T) => React.ReactNode;
  }[];
  loading?: boolean;
  emptyMessage?: string;
  rowHeight?: number;
  overscan?: number;
  sx?: any;
}

export function PerformanceTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "暂无数据",
  rowHeight = 48,
  overscan = 10,
  sx,
}: PerformanceTableProps<T>) {
  const theme = useTheme();

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => document.getElementById("table-container"),
    estimateSize: () => rowHeight,
    overscan,
  });

  const paddingTop = rowVirtualizer.getVirtualItems()[0]?.start || 0;
  const paddingBottom =
    rowVirtualizer.getTotalSize() -
    (paddingTop + rowVirtualizer.getVirtualItems().length * rowHeight);

  if (loading) {
    return (
      <Paper sx={{ ...sx }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  sx={{
                    width: column.width,
                    backgroundColor: "background.paper",
                    borderBottom: `2px solid divider`,
                  }}
                >
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      id="table-container"
      sx={{
        height: "auto",
        overflow: "auto",
        position: "relative",
        ...sx,
      }}
    >
      <Table stickyHeader sx={{ borderCollapse: "separate" }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={String(column.key)}
                sx={{
                  width: column.width,
                  backgroundColor: "background.paper",
                  borderBottom: `2px solid divider`,
                }}
              >
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{
                  textAlign: "center",
                  py: 3,
                  color: "text.secondary",
                }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            <>
              {paddingTop > 0 && (
                <TableRow sx={{
                  '&:nth-of-type(odd)': { backgroundColor: alpha(theme.palette.primary.light, 0.05) },
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.light, 0.1) },
                  cursor: 'pointer',
                }}>
                  <TableCell style={{ height: paddingTop }} colSpan={columns.length} />
                </TableRow>
              )}
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = data[virtualRow.index];
                return (
                  <TableRow
                    key={virtualRow.index}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: alpha(
                          theme.palette.primary.light,
                          0.05
                        ),
                      },
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.light,
                          0.1
                        ),
                      },
                      cursor: "pointer",
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]?.toString()}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {paddingBottom > 0 && (
                <TableRow>
                  <TableCell
                    style={{ height: paddingBottom }}
                    colSpan={columns.length}
                  />
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
