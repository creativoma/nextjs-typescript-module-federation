import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useSWRImmutable from "swr/immutable";
import { faker } from "@faker-js/faker";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";

const fetcher = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return generateData(15682);
};

const generateData = (amount: number) => {
  const data = [];
  for (let i = 0; i < amount; i++) {
    data.push({
      id: i + 1,
      col1: faker.person.firstName(),
      col2: faker.person.lastName(),
      col3: faker.internet.email(),
      col4: faker.phone.number(),
      col5: faker.location.city(),
    });
  }
  return data;
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "col1", headerName: "Name", width: 105 },
  { field: "col2", headerName: "Last Name", width: 105 },
  { field: "col3", headerName: "Email", width: 325 },
  { field: "col4", headerName: "Phone", width: 250 },
  { field: "col5", headerName: "City", width: 150 },
];

const Table = () => {
  const { data: rows, error } = useSWRImmutable("dummy-key", fetcher);

  if (error) return <div>Error al cargar los datos</div>;
  if (!rows) return <div>Cargando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="w-full h-[650px]"
    >
      <DataGrid
        rows={rows}
        columns={columns}
        className="text-black dark:text-white"
        slotProps={{
          row: { className: "text-black dark:text-white" },
          cell: {
            className: "text-black dark:text-white",
          },
          pagination: { className: "text-black dark:text-white" },
        }}
      />
    </motion.div>
  );
};

export default Table;
