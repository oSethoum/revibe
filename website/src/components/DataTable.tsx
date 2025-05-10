import {
  ActionIcon,
  Menu,
  Pagination,
  Paper,
  Stack,
  Table,
  Popover,
  Switch,
  Tooltip,
  Center,
  Title,
  Group,
} from "@mantine/core";
import type { MantineColor, MantineSize } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconDatabaseX, IconDots, IconEye } from "@tabler/icons-react";

export interface DataTableProps {
  storageKey: string;
  columns: Array<{
    accessor: string;
    title: React.ReactNode;
    width?: string;
    hidden?: boolean;
    render?: (record: any, index?: number) => React.ReactNode;
  }>;
  minWidth?: string;
  showHideLabel?: string;
  records: Array<any>;
  striped?: boolean;
  withTableBorder?: boolean;
  withRowBorders?: boolean;
  withColumnBorders?: boolean;
  stockyHeader?: boolean;
  stickyHeader?: boolean;
  stickyHeaderOffset?: number;
  shadow?: MantineSize;
  wrapWhiteSpace?: boolean;
  size?: MantineSize;
  page?: number;
  recordsPerPage?: number;
  totalRecords?: number;
  withRowNumber?: boolean;
  onPageChange?: (page: number) => void;
  hideActions?: boolean;
  actions?: (record: any) => Array<{
    title: React.ReactNode;
    hidden?: boolean;
    color?: MantineColor;
    icon?: React.ReactNode;
    onClick: () => void;
  }>;
}

export default function ({
  columns,
  records,
  withTableBorder,
  minWidth,
  shadow,
  page,
  onPageChange,
  recordsPerPage,
  totalRecords,
  wrapWhiteSpace,
  showHideLabel,
  actions,
  hideActions,
  withRowNumber,
  storageKey,
  ...props
}: DataTableProps) {
  const [hiddenColumns, setHiddenColumns] = useLocalStorage<string[]>({
    key: storageKey,
    defaultValue: ["id"],
    getInitialValueInEffect: false,
  });

  const hide = (value: string) => {
    setHiddenColumns([...hiddenColumns, value]);
  };

  const show = (value: string) => {
    setHiddenColumns(hiddenColumns.filter((v) => v != value));
  };

  const headers = columns.map((column, index) => {
    if (hiddenColumns.includes(column.accessor)) {
      return null;
    }

    return (
      <Table.Th key={index} w={column.width}>
        {column.title}
      </Table.Th>
    );
  });

  const elements = records.map((record, rowIndex) => (
    <Table.Tr key={rowIndex}>
      {withRowNumber && (
        <Table.Td w="0%">
          {countRowNumber(rowIndex, page, recordsPerPage)}
        </Table.Td>
      )}

      {columns.map((column, index) => {
        if (hiddenColumns.includes(column.accessor)) {
          return null;
        }

        return column.render ? (
          <Table.Td key={index} width={column.width}>
            {column.render(record, rowIndex)}
          </Table.Td>
        ) : (
          <Table.Td key={index}>
            {record[column.accessor] != undefined
              ? record[column.accessor]
              : ""}
          </Table.Td>
        );
      })}
      {!hideActions && actions && actions(record).length > 0 && (
        <Table.Td p={4}>
          <Menu position="bottom-end" shadow="sm" withArrow width={150}>
            <Menu.Target>
              <ActionIcon variant="default" style={{ border: "none" }}>
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              {actions(record).map((action, index) =>
                action.hidden ? null : (
                  <Menu.Item
                    key={index}
                    leftSection={action.icon}
                    onClick={() => {
                      action.onClick();
                    }}
                    color={action.color}
                    styles={{
                      item: {
                        fontSize: 15,
                        padding: "4px 10px",
                      },
                    }}
                  >
                    {action.title}
                  </Menu.Item>
                )
              )}
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      )}
    </Table.Tr>
  ));

  return (
    <Stack gap="sm" style={{ whiteSpace: wrapWhiteSpace ? "wrap" : "nowrap" }}>
      <Paper withBorder={withTableBorder} shadow={shadow}>
        <Table.ScrollContainer minWidth={"100%"}>
          <Table {...props} style={{ position: "relative" }}>
            <Table.Thead style={{ whiteSpace: "nowrap" }}>
              <Table.Tr>
                {withRowNumber && <Table.Th w="0%">#</Table.Th>}
                {headers}
                <Table.Th w="0%" p={4}>
                  <Popover position="bottom-end">
                    <Popover.Target>
                      <Tooltip label={showHideLabel || "Show or hide columns"}>
                        <ActionIcon
                          variant="default"
                          style={{ border: "none" }}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Popover.Target>
                    <Popover.Dropdown p="xs">
                      <Stack gap="xs">
                        {columns.map((column) => (
                          <Switch
                            checked={!hiddenColumns.includes(column.accessor)}
                            key={column.accessor}
                            onChange={(e) => {
                              if (e.currentTarget.checked) {
                                show(column.accessor);
                              } else {
                                hide(column.accessor);
                              }
                            }}
                            label={column.title}
                          />
                        ))}
                      </Stack>
                    </Popover.Dropdown>
                  </Popover>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{elements}</Table.Tbody>
          </Table>
          {(!records || records.length == 0) && (
            <Center h={150}>
              <Stack>
                <IconDatabaseX size={50} />
                <Title order={5}>Empty</Title>
              </Stack>
            </Center>
          )}
        </Table.ScrollContainer>
      </Paper>

      {shouldPaginate(totalRecords, recordsPerPage, onPageChange, page) && (
        <Group justify="space-between">
          <Paper withBorder px="sm">
            {showingLabel(page, totalRecords, recordsPerPage)}
          </Paper>
          <Pagination
            style={{ alignSelf: "flex-end" }}
            total={Math.ceil(
              totalRecords && recordsPerPage ? totalRecords / recordsPerPage : 0
            )}
            size="sm"
            value={page}
            onChange={(value) => {
              onPageChange?.(value);
            }}
          />
        </Group>
      )}
    </Stack>
  );
}

const countRowNumber = (index: number, page?: number, limit?: number) => {
  index++;
  if (page != undefined && limit != undefined) {
    return index + (page - 1) * limit;
  }
  return index;
};

const shouldPaginate = (
  totalRecords?: number,
  recordsPerPage?: number,
  onPageChange?: (page: number) => void,
  page?: number
) => {
  if (!totalRecords || !recordsPerPage || !onPageChange || !page) {
    return false;
  }

  if (totalRecords / recordsPerPage > 1) {
    return true;
  }

  return false;
};

const showingLabel = (page?: number, total?: number, limit?: number) => {
  if (page != undefined && total != undefined && limit != undefined) {
    const start = (page - 1) * limit + 1;
    const end = start + limit - 1 > total ? total : start + limit - 1;
    return `${start} - ${end} / ${total}`;
  }
  return "";
};
