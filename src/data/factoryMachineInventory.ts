/**
 * Official Factory Machine Inventory Data
 * Parsed from factory equipment master data.
 *
 * Location Allocation Rules:
 * - Lokasi TW1  -> Peruntukan Line 1 & Line 3
 * - Lokasi TW38 -> Peruntukan Line 4, 5, 6, 7
 */

export interface MachineInventoryRecord {
  inventoryNo: string;
  machineName: string;
  brand: string;
  purchaseDate: string;
  location: "TW1" | "TW38" | "TEBET" | "TERJUAL" | "LAINNYA";
  madeIn: string;
  condition: "Normal" | "Rusak" | "Terjual";
  availableQty: number;
  machineGroup: string;
}

export const FACTORY_MACHINE_INVENTORY_RAW: MachineInventoryRecord[] = [
  {
    "inventoryNo": "TW-MPP-00001",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00002",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00003",
    "machineName": "Steam Boiler Listrik",
    "brand": "Nissin",
    "purchaseDate": "2020-04-06 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00004",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00005",
    "machineName": "Mesin Jarum 1 (DDL-900B",
    "brand": "Juki",
    "purchaseDate": "2018-09-27 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00006",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00007",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00008",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00009",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00011",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-06-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00012",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-06-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00013",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-08-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00015",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-12 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00016",
    "machineName": "Mesin Bordir Dua Kepala",
    "brand": "Azura",
    "purchaseDate": "2019-07-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00017",
    "machineName": "Mesin Potong Pola Kertas",
    "brand": "J-Wei",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00018",
    "machineName": "Mesin Gulung Benang WJ-20S",
    "brand": "Weijie",
    "purchaseDate": "2023-04-03 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00019",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00020",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00021",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00022",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-12 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00023",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-08-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00024",
    "machineName": "Mesin Pasang Tangan",
    "brand": "Durkop",
    "purchaseDate": "2021-03-25 00:00:00",
    "location": "TW1",
    "madeIn": "Germany",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00025",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00026",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00028",
    "machineName": "Mesin Obras MO-6800JUKI",
    "brand": "Juki",
    "purchaseDate": "2018-08-07 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00029",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00030",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-12 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00031",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00281",
    "machineName": "Mesin jarum 1 S-7180a",
    "brand": "Brother",
    "purchaseDate": "2021-10-26 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00033",
    "machineName": "Mesin Obras MO-6816D JUKI",
    "brand": "Juki",
    "purchaseDate": "2023-02-24 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00471",
    "machineName": "Mesin Soom JC 9330-0",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Soom"
  },
  {
    "inventoryNo": "TW-MPP-00035",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-12 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00037",
    "machineName": "Mesin Press NS-450MS",
    "brand": "Nissin",
    "purchaseDate": "2022-11-08 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00038",
    "machineName": "Mesin Press HP-900LFS",
    "brand": "Hashima",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00039",
    "machineName": "Mesin Lubang Kancing QQ RH-982A",
    "brand": "Brother",
    "purchaseDate": "2022-08-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Mesin QQ"
  },
  {
    "inventoryNo": "TW-MPP-00040",
    "machineName": "Mesin BASS HOKI",
    "brand": "Hoki",
    "purchaseDate": "2023-04-19 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bass"
  },
  {
    "inventoryNo": "TW-MPP-00041",
    "machineName": "Mesin Make Up MS-1190",
    "brand": "Juki",
    "purchaseDate": "2022-07-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Makeup"
  },
  {
    "inventoryNo": "TW-MPP-00042",
    "machineName": "Mesin Bobok Kantong APW-895N",
    "brand": "Juki",
    "purchaseDate": "2022-09-01 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "APW"
  },
  {
    "inventoryNo": "TW-MPP-00043",
    "machineName": "Mesin Pasang Kancing  BE-438 C",
    "brand": "Brother",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Pasang Kancing"
  },
  {
    "inventoryNo": "TW-MPP-00044",
    "machineName": "Mesin Lubang Kancing HE-800C-2",
    "brand": "Brother",
    "purchaseDate": "2020-02-13 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00046",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-10-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00047",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-10-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00048",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-10-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00049",
    "machineName": "Mesin Obras MO-6816S JUKI",
    "brand": "Juki",
    "purchaseDate": "2022-07-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00507",
    "machineName": "Mesin Make Up MS-1190",
    "brand": "Juki",
    "purchaseDate": "2024-11-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Makeup"
  },
  {
    "inventoryNo": "TW-MPP-00055",
    "machineName": "Mesin Press Buaya",
    "brand": "-",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00056",
    "machineName": "Mesin Jarum 1 S7100",
    "brand": "Brother",
    "purchaseDate": "2005-12-05 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00057",
    "machineName": "Mesin Jarum 1 Manual FY8700",
    "brand": "Feiyue",
    "purchaseDate": "2008-05-10 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00058",
    "machineName": "Mesin Jarum 1  ZJ9701R-D3",
    "brand": "Zoje",
    "purchaseDate": "2011-11-28 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00059",
    "machineName": "Mesin Jarum 1  ZJ9701R-D3",
    "brand": "Zoje",
    "purchaseDate": "2011-11-23 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00060",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00062",
    "machineName": "Mesin Jarum 1  ZJ9701R-D3",
    "brand": "Zoje",
    "purchaseDate": "2011-11-28 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00063",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00064",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00065",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00066",
    "machineName": "Meja Gosok",
    "brand": "-",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00067",
    "machineName": "Meja gosok",
    "brand": "-",
    "purchaseDate": "2016-01-01 00:00:00",
    "location": "TW1",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00068",
    "machineName": "Mesin Bartack KE-430FS",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bartack"
  },
  {
    "inventoryNo": "TW-MPP-00069",
    "machineName": "Mesin Jarum 1 (DDL-900B)",
    "brand": "Juki",
    "purchaseDate": "2018-09-27 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00071",
    "machineName": "Mesin Ban Karet YAMATA",
    "brand": "Yamata",
    "purchaseDate": "2008-04-10 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Kansai 7/8+Cr"
  },
  {
    "inventoryNo": "TW-MPP-00072",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00073",
    "machineName": "Mesin Jarum 1 (DDL-900B)",
    "brand": "Juki",
    "purchaseDate": "2018-09-27 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00074",
    "machineName": "Mesin Jarum 1 (DDL-900B)",
    "brand": "Juki",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00075",
    "machineName": "Steam Boiler Listrik",
    "brand": "Nissin",
    "purchaseDate": "2020-04-06 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00076",
    "machineName": "Mesin Bartack KE-430FS",
    "brand": "Brother",
    "purchaseDate": "2018-07-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bartack"
  },
  {
    "inventoryNo": "INV-66",
    "machineName": "--",
    "brand": "-",
    "purchaseDate": "-",
    "location": "LAINNYA",
    "madeIn": "-",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00079",
    "machineName": "Mesin SIDE CUTTER GC6170",
    "brand": "Typical",
    "purchaseDate": "2013-12-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SC"
  },
  {
    "inventoryNo": "TW-MPP-00080",
    "machineName": "Mesin Jarum 2 Brother T-8450C-003",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00081",
    "machineName": "Mesin Pasang Kancing BE-438 D",
    "brand": "Brother",
    "purchaseDate": "2007-08-08 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Pasang Kancing"
  },
  {
    "inventoryNo": "TW-MPP-00082",
    "machineName": "Mesin Obras Corong M700 HOKI",
    "brand": "Hoki",
    "purchaseDate": "2023-04-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 4 + Cr"
  },
  {
    "inventoryNo": "TW-MPP-00083",
    "machineName": "Mesin Tandem GC0058",
    "brand": "Typical",
    "purchaseDate": "2016-09-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Tandem"
  },
  {
    "inventoryNo": "TW-MPP-00084",
    "machineName": "Mesin Tali Loop(Over Deck) FY2700",
    "brand": "Feiyue",
    "purchaseDate": "2009-04-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Overdeck"
  },
  {
    "inventoryNo": "TW-MPP-00086",
    "machineName": "Mesin Make Up DA-927086",
    "brand": "Brother",
    "purchaseDate": "2021-01-18 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Makeup"
  },
  {
    "inventoryNo": "TW-MPP-00472",
    "machineName": "Mesin Soom JC 9330-0",
    "brand": "Brother",
    "purchaseDate": "2025-08-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Soom"
  },
  {
    "inventoryNo": "TW-MPP-00089",
    "machineName": "Mesin Jarum 2 GC842",
    "brand": "Nissin",
    "purchaseDate": "2016-09-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00090",
    "machineName": "Mesin  SIDE CUTTER",
    "brand": "Zoje",
    "purchaseDate": "-",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SC"
  },
  {
    "inventoryNo": "TW-MPP-00091",
    "machineName": "Mesin Jarum 2 GC842",
    "brand": "Nissin",
    "purchaseDate": "-",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00092",
    "machineName": "Mesin Obras MO-6700 JUKI",
    "brand": "Juki",
    "purchaseDate": "2011-05-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00095",
    "machineName": "Meja Gosok",
    "brand": "-",
    "purchaseDate": "2005-12-05 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00096",
    "machineName": "Meja Gosok",
    "brand": "-",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "TW38",
    "madeIn": "Indonesia",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00097",
    "machineName": "Meja Gosok Megochi",
    "brand": "megochi",
    "purchaseDate": "2019-09-18 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00100",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-02-10 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00103",
    "machineName": "Meja Gosok",
    "brand": "-",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00104",
    "machineName": "Meja Gosok",
    "brand": "-",
    "purchaseDate": "2020-03-01 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00105",
    "machineName": "Meja Gosok",
    "brand": "-",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00106",
    "machineName": "Meja Gosok",
    "brand": "-",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00107",
    "machineName": "Meja Gosok",
    "brand": "-",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00108",
    "machineName": "Mesin Obras MO-6814 JUKI",
    "brand": "Juki",
    "purchaseDate": "2023-04-06 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00110",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-02-10 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00112",
    "machineName": "Mesin GERBER Potong Otomatis Gelaran Tebal",
    "brand": "Gerber",
    "purchaseDate": "2022-02-05 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00477",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-19 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00115",
    "machineName": "Meja Gosok",
    "brand": "-",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "LAINNYA",
    "madeIn": "Indonesia",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00116",
    "machineName": "Meja Gosok",
    "brand": "-",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "TW38",
    "madeIn": "Indonesia",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00517",
    "machineName": "Mesin Lubang Kancing HE-800C-2",
    "brand": "Brother",
    "purchaseDate": "2022-06-19 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00119",
    "machineName": "Mesin Jarum 1  ZJ9701R-D3",
    "brand": "Zoje",
    "purchaseDate": "2011-11-28 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00120",
    "machineName": "Boiler Gas",
    "brand": "-",
    "purchaseDate": "2006-06-01 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00121",
    "machineName": "Boiler Solar",
    "brand": "-",
    "purchaseDate": "2000-01-01 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00327",
    "machineName": "Mesin BASS BRC-T3520MA",
    "brand": "Bruce",
    "purchaseDate": "2025-04-26 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bass"
  },
  {
    "inventoryNo": "TW-MPP-00125",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00126",
    "machineName": "Mesin Jarum 1 (DDL-900B)",
    "brand": "Juki",
    "purchaseDate": "2019-02-02 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00127",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00128",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00131",
    "machineName": "Mesin Jarum 1 (DDL8700B-7)",
    "brand": "Juki",
    "purchaseDate": "2016-01-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00132",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00133",
    "machineName": "Mesin Jarum 1 S7100H",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00134",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00135",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00136",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00137",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00138",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00139",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00339",
    "machineName": "Mesin BASS BRC-T3520MA",
    "brand": "Bruce",
    "purchaseDate": "2025-04-26 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bass"
  },
  {
    "inventoryNo": "TW-MPP-00141",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00142",
    "machineName": "Meja Gosok Suesei",
    "brand": "Suesei",
    "purchaseDate": "2020-03-20 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00143",
    "machineName": "Mesin Jarum 1 (DDL-900B)",
    "brand": "Juki",
    "purchaseDate": "2019-02-02 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00145",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00146",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00147",
    "machineName": "Mesin Pasang Tangan",
    "brand": "Durkop",
    "purchaseDate": "2021-03-25 00:00:00",
    "location": "TW38",
    "madeIn": "Germany",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00148",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-10-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00149",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00150",
    "machineName": "Mesin Jarum 1 (DDL-900B)",
    "brand": "Juki",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00151",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-08-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00152",
    "machineName": "Meja Gosok Suesei",
    "brand": "Suesei",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "TW38",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00153",
    "machineName": "Mesin Pasang Kancing BE-438HS",
    "brand": "Brother",
    "purchaseDate": "2022-06-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Pasang Kancing"
  },
  {
    "inventoryNo": "TW-MPP-00159",
    "machineName": "Mesin Tandem MS0058-1A-2",
    "brand": "Mitsubishi",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Tandem"
  },
  {
    "inventoryNo": "TW-MPP-00160",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00161",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00162",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-10-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00163",
    "machineName": "Mesin Bordir Barudan BEKS-Y920 (600X300/300 MM)",
    "brand": "Barudan",
    "purchaseDate": "2021-01-28 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00164",
    "machineName": "Stabilizer Digital 6 KVA AVR - LD 6GT",
    "brand": "Matsuyama",
    "purchaseDate": "2021-01-28 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00165",
    "machineName": "Stabilizer Digital 15 KVA AVR - LD 15 GS",
    "brand": "Matsuyama",
    "purchaseDate": "2021-04-10 00:00:00",
    "location": "TW1",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00166",
    "machineName": "Mesin Jarum 1 GC6180",
    "brand": "Typical",
    "purchaseDate": "2011-06-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00167",
    "machineName": "Mesin Obras MO-6816D JUKI",
    "brand": "Juki",
    "purchaseDate": "2023-04-06 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00168",
    "machineName": "Mesin Jarum 2 Sicama LT2-B848-380",
    "brand": "Sicama",
    "purchaseDate": "-",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00172",
    "machineName": "Mesin Jarum 1  ZJ9701R-D3",
    "brand": "Zoje",
    "purchaseDate": "2011-11-28 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00173",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00174",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00178",
    "machineName": "Mesin Zig Zag",
    "brand": "Yamata",
    "purchaseDate": "-",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Zigzag"
  },
  {
    "inventoryNo": "TW-MPP-00179",
    "machineName": "PNEUMATIC SNAP BUTTON / RIVET NS-Q3 / NISSIN",
    "brand": "Nissin",
    "purchaseDate": "2023-04-06 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Snap Attaching"
  },
  {
    "inventoryNo": "TW-MPP-00180",
    "machineName": "Mesin Tandem GC0058",
    "brand": "Typical",
    "purchaseDate": "2013-01-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Tandem"
  },
  {
    "inventoryNo": "TW-MPP-00628",
    "machineName": "Mesin BASS BRC-T3520MA",
    "brand": "bruce",
    "purchaseDate": "2024-10-25 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bass"
  },
  {
    "inventoryNo": "TW-MPP-00182",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-02-10 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00183",
    "machineName": "Mesin Press NS-450MS",
    "brand": "Nissin",
    "purchaseDate": "2022-11-08 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00184",
    "machineName": "Mesin Press HP-900LFS",
    "brand": "Hashima",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00185",
    "machineName": "Auto Cut J-wei CB03II-2516-RQ",
    "brand": "J-Wei",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00188",
    "machineName": "Mesin Balik Kerah",
    "brand": "Ngai Shing",
    "purchaseDate": "2023-05-31 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00189",
    "machineName": "Mesin Press Manset",
    "brand": "Ngai Shing",
    "purchaseDate": "2023-05-31 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00190",
    "machineName": "Mesin Pasang Gembol M-2612TZ",
    "brand": "Maica",
    "purchaseDate": "2023-06-06 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00191",
    "machineName": "Mesin Tamplate  JKC-NS2-13095-LM-LC1",
    "brand": "Jooke",
    "purchaseDate": "2023-06-06 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00193",
    "machineName": "GENSET 250KVA",
    "brand": "Catterpilar",
    "purchaseDate": "2022-01-05 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00194",
    "machineName": "Mesin Potong Karet NTK-098V",
    "brand": "MTK (NTK-098V)",
    "purchaseDate": "2020-02-13 00:00:00",
    "location": "TW38",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00195",
    "machineName": "Mesin Inspek Bahan",
    "brand": "Rekondisi",
    "purchaseDate": "2022-04-16 00:00:00",
    "location": "TW38",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00196",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-10 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00198",
    "machineName": "Automatic Voltage Regulator SVC-3000VA",
    "brand": "Matsunaga",
    "purchaseDate": "2023-06-07 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00199",
    "machineName": "Charger Aki",
    "brand": "-",
    "purchaseDate": "-",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00200",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00201",
    "machineName": "Mesin Bartack KE-430FS",
    "brand": "Brother",
    "purchaseDate": "2017-12-22 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bartack"
  },
  {
    "inventoryNo": "TW-MPP-00202",
    "machineName": "Mesin Pasang Kancing BE-438HS",
    "brand": "Brother",
    "purchaseDate": "2023-04-05 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Pasang Kancing"
  },
  {
    "inventoryNo": "TW-MPP-00203",
    "machineName": "Mesin Lubang Kancing HE-800C-2",
    "brand": "Brother",
    "purchaseDate": "2021-01-18 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00204",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00205",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00206",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00207",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00208",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00209",
    "machineName": "Mesin Obras MO-6816S JUKI",
    "brand": "Juki",
    "purchaseDate": "2018-08-07 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00210",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-06-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00211",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-06-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00212",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00213",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-08-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00214",
    "machineName": "Mesin Jarum 1 S7250A",
    "brand": "Brother",
    "purchaseDate": "2019-04-11 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00215",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-05 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00216",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00217",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00218",
    "machineName": "Mesin Ban Karet (Kansai Plaket) DFB1404PMD",
    "brand": "Kansai sp",
    "purchaseDate": "2022-06-01 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Kansai 7/8+Cr"
  },
  {
    "inventoryNo": "TW-MPP-00220",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00222",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-08-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00223",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-06-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00224",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00226",
    "machineName": "Mesin Obras MO-6816D JUKI",
    "brand": "Juki",
    "purchaseDate": "2018-08-07 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00227",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00228",
    "machineName": "Mesin Obras MO-6816S JUKI",
    "brand": "Juki",
    "purchaseDate": "2018-08-07 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00230",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00231",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00233",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00234",
    "machineName": "Mesin Jarum 1  ZJ9701R-D3",
    "brand": "Zoje",
    "purchaseDate": "2011-11-28 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00235",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-10-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00236",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00237",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00238",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00239",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-10-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00240",
    "machineName": "Mesin Obras MO-6816S JUKI",
    "brand": "Juki",
    "purchaseDate": "2022-07-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00242",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-10-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00244",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00245",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00246",
    "machineName": "Mesin Tali Loop(Over Deck) JK-8669ID",
    "brand": "Jack",
    "purchaseDate": "2020-02-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Overdeck"
  },
  {
    "inventoryNo": "TW-MPP-00248",
    "machineName": "Mesin Jarum 2 ZJ845",
    "brand": "Zoje",
    "purchaseDate": "2016-09-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00249",
    "machineName": "Mesin Obras Corong M700 HOKI",
    "brand": "Hoki",
    "purchaseDate": "2023-04-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 4 + Cr"
  },
  {
    "inventoryNo": "TW-MPP-00250",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00251",
    "machineName": "Mesin Tandem MS0058-1A-2",
    "brand": "Mitsubishi",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Tandem"
  },
  {
    "inventoryNo": "TW-MPP-00252",
    "machineName": "Mesin Obras HX6816T-03 HIKARI",
    "brand": "Hikari",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00253",
    "machineName": "PNEUMATIC SNAP BUTTON / RIVET NS-Q3 / NISSIN",
    "brand": "Nissin",
    "purchaseDate": "2023-04-06 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Snap Attaching"
  },
  {
    "inventoryNo": "TW-MPP-00254",
    "machineName": "Mesin Jarum 1 (DDL8700B-7)",
    "brand": "Juki",
    "purchaseDate": "2016-01-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00255",
    "machineName": "Mesin Jarum 2 LH 3568A-7",
    "brand": "Juki",
    "purchaseDate": "2017-12-22 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00256",
    "machineName": "Mesin  SIDE CUTTER GC6170",
    "brand": "Typical",
    "purchaseDate": "2013-12-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "SC"
  },
  {
    "inventoryNo": "TW-MPP-00257",
    "machineName": "Mesin Lubang Kancing Kemeja HE-800B",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00258",
    "machineName": "Mesin Bartack KE-430Fs-03",
    "brand": "Brother",
    "purchaseDate": "2021-01-18 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bartack"
  },
  {
    "inventoryNo": "TW-MPP-00259",
    "machineName": "Mesin Pasang Kancing BE-438HS",
    "brand": "Brother",
    "purchaseDate": "2023-04-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Pasang Kancing"
  },
  {
    "inventoryNo": "TW-MPP-00260",
    "machineName": "Mesin pasang kancing BE-438HS",
    "brand": "Brother",
    "purchaseDate": "2022-06-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Pasang Kancing"
  },
  {
    "inventoryNo": "TW-MPP-00262",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00263",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00264",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-06-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00265",
    "machineName": "Mesin Tandem GC0058",
    "brand": "Typical",
    "purchaseDate": "2016-09-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Tandem"
  },
  {
    "inventoryNo": "TW-MPP-00575",
    "machineName": "Mesin Obras MO-6800 JUKI",
    "brand": "Juki",
    "purchaseDate": "2022-07-22 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00268",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00269",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00270",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-06-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00271",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00272",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-08-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00273",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-05 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00275",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00276",
    "machineName": "Mesin Pasang Tangan",
    "brand": "Durkop",
    "purchaseDate": "2022-10-01 00:00:00",
    "location": "TW38",
    "madeIn": "Germany",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00277",
    "machineName": "Mesin Blind Stitch HS-160-20",
    "brand": "Hikari",
    "purchaseDate": "2013-07-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Blind Tack"
  },
  {
    "inventoryNo": "TW-MPP-00278",
    "machineName": "Mesin Gulung Benang Benho",
    "brand": "Benho",
    "purchaseDate": "2023-04-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00279",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00280",
    "machineName": "Mesin Jarum 2 T-8450C-003",
    "brand": "Brother",
    "purchaseDate": "2016-09-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00635",
    "machineName": "Mesin BASS BRC-T3520MA",
    "brand": "Bruce",
    "purchaseDate": "2024-12-04 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bass"
  },
  {
    "inventoryNo": "TW-MPP-00282",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-08-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00283",
    "machineName": "Mesin jarum 1 S-7180a",
    "brand": "Brother",
    "purchaseDate": "2021-10-26 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00284",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00285",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00287",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-08-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00288",
    "machineName": "Mesin Jarum 1 DDL8000",
    "brand": "Juki",
    "purchaseDate": "2019-10-10 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00290",
    "machineName": "Mesin Ban Karet (Kansai Plaket) DFB1404PMD",
    "brand": "Kansai sp",
    "purchaseDate": "2019-04-01 00:00:00",
    "location": "TW1",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Kansai 7/8+Cr"
  },
  {
    "inventoryNo": "TW-MPP-00291",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00292",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00293",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00294",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-12 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00295",
    "machineName": "Mesin Obras MO-6816D JUKI",
    "brand": "Juki",
    "purchaseDate": "2023-04-06 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00296",
    "machineName": "Mesin Pasang Kancing BE-438HS",
    "brand": "Brother",
    "purchaseDate": "2019-04-11 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Pasang Kancing"
  },
  {
    "inventoryNo": "TW-MPP-00297",
    "machineName": "Mesin Soom JC 9330-0",
    "brand": "Brother",
    "purchaseDate": "2019-04-12 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Soom"
  },
  {
    "inventoryNo": "TW-MPP-00299",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-06-01 00:00:00",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00776",
    "machineName": "Mesin Obras MO-6816D JUKI",
    "brand": "Juki",
    "purchaseDate": "2023-04-06 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00302",
    "machineName": "Mesin Make Up ZJ927-P2D",
    "brand": "Zoje",
    "purchaseDate": "-",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Makeup"
  },
  {
    "inventoryNo": "TW-MPP-00309",
    "machineName": "Mesin Make Up MS-1190",
    "brand": "Juki",
    "purchaseDate": "2023-05-02 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Makeup"
  },
  {
    "inventoryNo": "TW-MPP-00310",
    "machineName": "Mesin Lubang Kancing HE-800C-2",
    "brand": "Brother",
    "purchaseDate": "2023-04-10 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00311",
    "machineName": "Mesin Bartack KE-430HS-03",
    "brand": "Brother",
    "purchaseDate": "2023-04-10 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bartack"
  },
  {
    "inventoryNo": "TW-MPP-00312",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2010-01-23 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00600",
    "machineName": "Mesin Gurinda duduk",
    "brand": "domax",
    "purchaseDate": "2025-08-07 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00340",
    "machineName": "Mesin Pasang Tangan",
    "brand": "Durkop",
    "purchaseDate": "2025-12-01 00:00:00",
    "location": "TW38",
    "madeIn": "Germany",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00316",
    "machineName": "Mesin Indexer Button Holling MA04G",
    "brand": "Maica",
    "purchaseDate": "2024-06-25 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00317",
    "machineName": "Mesin Indexer Button Holling MA04G",
    "brand": "Maica",
    "purchaseDate": "2024-06-25 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00323",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00324",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00325",
    "machineName": "Mesin Pasang Tangan",
    "brand": "Durkop",
    "purchaseDate": "2024-08-22 00:00:00",
    "location": "TW1",
    "madeIn": "Germany",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00793",
    "machineName": "Mesin Bobok Kantong  APW-895N",
    "brand": "Juki",
    "purchaseDate": "2025-04-28 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "APW"
  },
  {
    "inventoryNo": "TW-MPP-00772",
    "machineName": "Conveyor Mesin Press HASHIMA HP-900LFC",
    "brand": "Hashima",
    "purchaseDate": "2024-10-20 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00328",
    "machineName": "Mesin Overdeck Nissin NS-562-01",
    "brand": "Nissin",
    "purchaseDate": "2025-05-06 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Overdeck"
  },
  {
    "inventoryNo": "TW-MPP-00330",
    "machineName": "Mesin Press HP-900LFS",
    "brand": "Hashima",
    "purchaseDate": "2023-04-28 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00331",
    "machineName": "Conveyor Mesin Press HASHIMA HP-900LFC",
    "brand": "Hashima",
    "purchaseDate": "2024-11-20 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00332",
    "machineName": "Mesin Press HP-900LFS",
    "brand": "Hashima",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00436",
    "machineName": "Mesin Side Cutter H99V-7C-5/AK",
    "brand": "Hikari",
    "purchaseDate": "2025-06-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SC"
  },
  {
    "inventoryNo": "TW-MPP-00335",
    "machineName": "Mesin BORDIR Barudan BEKY Y904 II",
    "brand": "Barudan",
    "purchaseDate": "2025-05-13 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00437",
    "machineName": "Mesin Side Cutter H99V-7C-5/AK",
    "brand": "Hikari",
    "purchaseDate": "2025-06-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SC"
  },
  {
    "inventoryNo": "TW-MPP-00034",
    "machineName": "Mesin Plotter",
    "brand": "HP",
    "purchaseDate": "2017-02-01 00:00:00",
    "location": "TW38",
    "madeIn": "USA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00181",
    "machineName": "MESIN PLOTTER",
    "brand": "HP",
    "purchaseDate": "2015-11-04 00:00:00",
    "location": "TW1",
    "madeIn": "USA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00523",
    "machineName": "Mesin Plotter ATP JET",
    "brand": "HP",
    "purchaseDate": "2023-01-11 00:00:00",
    "location": "TW38",
    "madeIn": "USA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00564",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00399",
    "machineName": "Mesin Lubang QQ RH-982A",
    "brand": "Brother",
    "purchaseDate": "2025-05-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00401",
    "machineName": "Mesin Obras GN-795",
    "brand": "Typical",
    "purchaseDate": "2009-04-03 00:00:00",
    "location": "TEBET",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00402",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TEBET",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00403",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2009-12-23 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00404",
    "machineName": "Mesin Lubang Kancing QQ RH-980A",
    "brand": "Brother",
    "purchaseDate": "2018-05-15 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Mesin QQ"
  },
  {
    "inventoryNo": "TW-MPP-00405",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TEBET",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00406",
    "machineName": "Mesin Jarum 1  ZJ9701R-D2",
    "brand": "Zoje",
    "purchaseDate": "2011-11-23 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00407",
    "machineName": "Mesin Make Up DT6-8921",
    "brand": "Brother",
    "purchaseDate": "2017-12-01 00:00:00",
    "location": "TEBET",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Makeup"
  },
  {
    "inventoryNo": "TW-MPP-00408",
    "machineName": "Mesin Lubang Kancing HE-800C-2",
    "brand": "Brother",
    "purchaseDate": "2021-10-21 00:00:00",
    "location": "TEBET",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00409",
    "machineName": "Meja Gosok",
    "brand": "-",
    "purchaseDate": "2010-02-01 00:00:00",
    "location": "TEBET",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00410",
    "machineName": "Gosokan",
    "brand": "-",
    "purchaseDate": "-",
    "location": "TW38",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00413",
    "machineName": "PNEUMATIC SNAP BUTTON JUZI",
    "brand": "Juzi",
    "purchaseDate": "2010-10-05 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Snap Attaching"
  },
  {
    "inventoryNo": "TW-MPP-00414",
    "machineName": "Mesin Jarum 1  ZJ9701R-D3",
    "brand": "Zoje",
    "purchaseDate": "2011-11-28 00:00:00",
    "location": "TERJUAL",
    "madeIn": "China",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00415",
    "machineName": "Mesin SIDE CUTTER GC6170",
    "brand": "Typical",
    "purchaseDate": "2013-12-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SC"
  },
  {
    "inventoryNo": "TW-MPP-00417",
    "machineName": "Mesin Side CutterH99S",
    "brand": "Hikari",
    "purchaseDate": "2024-01-10 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SC"
  },
  {
    "inventoryNo": "INV-283",
    "machineName": "-",
    "brand": "-",
    "purchaseDate": "-",
    "location": "LAINNYA",
    "madeIn": "China",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00565",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00566",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00486",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00425",
    "machineName": "Mesin Soom JC 9330-01",
    "brand": "Brother",
    "purchaseDate": "2025-01-20 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Soom"
  },
  {
    "inventoryNo": "TW-MPP-00792",
    "machineName": "Mesin Jarum 2 Brother T-8450C-003",
    "brand": "Brother",
    "purchaseDate": "2025-01-20 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00427",
    "machineName": "Mesin Lubang Kancing Brother HE-800C-2",
    "brand": "Brother",
    "purchaseDate": "2025-06-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00428",
    "machineName": "Mesin Lubang Kancing  HE-800C-2",
    "brand": "Brother",
    "purchaseDate": "2025-06-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00429",
    "machineName": "Mesin Lubang Kancing HE-800C-2",
    "brand": "Brother",
    "purchaseDate": "2025-06-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00430",
    "machineName": "Mesin Pasang Kancing Brother BE-438HS",
    "brand": "Brother",
    "purchaseDate": "2025-06-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Pasang Kancing"
  },
  {
    "inventoryNo": "TW-MPP-00431",
    "machineName": "Mesin Pasang Kancing Brother BE-438HS",
    "brand": "Brother",
    "purchaseDate": "2025-06-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Pasang Kancing"
  },
  {
    "inventoryNo": "TW-MPP-00432",
    "machineName": "Mesin Pasang Kancing Brother BE-438HS",
    "brand": "Brother",
    "purchaseDate": "2025-06-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Pasang Kancing"
  },
  {
    "inventoryNo": "TW-MPP-00433",
    "machineName": "Mesin Bartack Brother KE-430HS-03",
    "brand": "Brother",
    "purchaseDate": "2025-06-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bartack"
  },
  {
    "inventoryNo": "TW-MPP-00434",
    "machineName": "Mesin Bartack Brother KE-430HS-03",
    "brand": "Brother",
    "purchaseDate": "2025-06-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bartack"
  },
  {
    "inventoryNo": "TW-MPP-00435",
    "machineName": "Mesin Bartack Brother KE-430HS-03",
    "brand": "Brother",
    "purchaseDate": "2025-06-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bartack"
  },
  {
    "inventoryNo": "TW-MPP-00568",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00569",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00570",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00439",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00440",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00441",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00442",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00443",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00444",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00445",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00446",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00447",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00448",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00449",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00450",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00572",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00452",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00453",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00454",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00455",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00456",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00457",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00458",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00459",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00460",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00461",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00464",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00465",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00466",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00467",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00468",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00469",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00586",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00314",
    "machineName": "Mesin Tamplate  JKC-NS2-13095-LM-LC1",
    "brand": "Jooke",
    "purchaseDate": "2025-04-28 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00315",
    "machineName": "Mesin Tamplate  JKC-NS2-13095-LM-LC1",
    "brand": "Jooke",
    "purchaseDate": "2025-04-28 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00473",
    "machineName": "Mesin Lubang QQ RH-982A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00474",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00475",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00476",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00518",
    "machineName": "Mesin Obras MO-6816S JUKI",
    "brand": "JUKI",
    "purchaseDate": "2025-03-14 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00778",
    "machineName": "Mesin Obras MO-6800 JUKI",
    "brand": "JUKI",
    "purchaseDate": "2016-01-16 00:00:00",
    "location": "TW1",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00479",
    "machineName": "Mesin Jarum 2 T-8450C-003",
    "brand": "Brother",
    "purchaseDate": "2020-07-01 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00498",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00499",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00500",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00508",
    "machineName": "Mesin Tamplate JKC-NS2-13095-LM-XH",
    "brand": "Jooke",
    "purchaseDate": "2025-08-13 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00509",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00510",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00526",
    "machineName": "Mesin Obras MO-6816D JUKI",
    "brand": "JUKI",
    "purchaseDate": "2016-01-16 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00531",
    "machineName": "Mesin Obras MO-6800s JUKI",
    "brand": "JUKI",
    "purchaseDate": "2018-08-16 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00545",
    "machineName": "Mesin Bobok Kantong  APW-895N",
    "brand": "JUKI",
    "purchaseDate": "2025-09-27 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "APW"
  },
  {
    "inventoryNo": "TW-MPP-00550",
    "machineName": "Mesin Obras MO-6800s JUKI",
    "brand": "JUKI",
    "purchaseDate": "-",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00588",
    "machineName": "Mesin Obras MO-6816S JUKI",
    "brand": "JUKI",
    "purchaseDate": "2022-07-18 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00594",
    "machineName": "Mesin Obras MO-6816S JUKI",
    "brand": "JUKI",
    "purchaseDate": "2023-04-06 00:00:00",
    "location": "TW1",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00470",
    "machineName": "Auto Cut J-wei CB03II-2516-RQ/Projectors",
    "brand": "J-Wei",
    "purchaseDate": "2025-06-13 00:00:00",
    "location": "TW38",
    "madeIn": "Taiwan",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00478",
    "machineName": "Mesin Ban Karet (Kansai Plaket) DFB1404PMD",
    "brand": "Kansai sp",
    "purchaseDate": "2017-12-02 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Kansai 7/8+Cr"
  },
  {
    "inventoryNo": "TW-MPP-00334",
    "machineName": "Stabilizer Digital 30 KVA AVR - LD 22,5 GT",
    "brand": "Matsuyama",
    "purchaseDate": "2025-05-06 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00113",
    "machineName": "Meja Gosok Megochi",
    "brand": "megochi",
    "purchaseDate": "2019-09-18 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00527",
    "machineName": "Meja Gosok Megochi",
    "brand": "megochi",
    "purchaseDate": "-",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00529",
    "machineName": "Meja Gosok Megochi",
    "brand": "megochi",
    "purchaseDate": "2019-02-04 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00530",
    "machineName": "Meja Gosok Megochi",
    "brand": "megochi",
    "purchaseDate": "-",
    "location": "LAINNYA",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00532",
    "machineName": "Meja Gosok Megochi",
    "brand": "megochi",
    "purchaseDate": "-",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00533",
    "machineName": "Meja Gosok Megochi",
    "brand": "megochi",
    "purchaseDate": "-",
    "location": "LAINNYA",
    "madeIn": "China",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00534",
    "machineName": "Meja Gosok Megochi",
    "brand": "megochi",
    "purchaseDate": "-",
    "location": "LAINNYA",
    "madeIn": "China",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00593",
    "machineName": "Meja Gosok Megochi",
    "brand": "megochi",
    "purchaseDate": "2019-02-04 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00140",
    "machineName": "BOILER LISTRIK",
    "brand": "Nissin",
    "purchaseDate": "2020-04-06 00:00:00",
    "location": "TW1",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00536",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00537",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00538",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00539",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00540",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00541",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00542",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00336",
    "machineName": "Mesin Pisau Lempar potong Gelaran NS-980D",
    "brand": "Nissin",
    "purchaseDate": "2025-03-14 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00337",
    "machineName": "Mesin Pisau Lempar potong Gelaran NS-980D",
    "brand": "Nissin",
    "purchaseDate": "2025-03-14 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00546",
    "machineName": "Mesin Obras MO-6816D JUKI",
    "brand": "Juki",
    "purchaseDate": "2025-03-14 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00547",
    "machineName": "Mesin Obras MO-6816D JUKI",
    "brand": "Juki",
    "purchaseDate": "2025-03-14 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00549",
    "machineName": "Mesin Jarum 1 (DDL-900B)",
    "brand": "Juki",
    "purchaseDate": "2018-09-27 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00338",
    "machineName": "Mesin Band Knife NS-BK900B",
    "brand": "Nissin",
    "purchaseDate": "2025-03-14 00:00:00",
    "location": "TW1",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00551",
    "machineName": "Mesin Jarum 1 (DDL-900B)",
    "brand": "Juki",
    "purchaseDate": "2016-01-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00552",
    "machineName": "Mesin Obras MO-6816D JUKI",
    "brand": "Juki",
    "purchaseDate": "2023-04-06 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00553",
    "machineName": "Mesin Obras MO-6816D JUKI",
    "brand": "Juki",
    "purchaseDate": "2023-04-06 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00555",
    "machineName": "Mesin Obras MO-6816D JUKI",
    "brand": "Juki",
    "purchaseDate": "2023-04-06 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00556",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-05 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00557",
    "machineName": "Mesin Jarum 1 (DDL-900B)",
    "brand": "Juki",
    "purchaseDate": "2019-02-02 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00558",
    "machineName": "Mesin Bass  JOOKE",
    "brand": "Jooke",
    "purchaseDate": "2023-10-26 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bass"
  },
  {
    "inventoryNo": "TW-MPP-00421",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2024-12-04 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00560",
    "machineName": "Mesin Obras MO-6800 JUKI",
    "brand": "Juki",
    "purchaseDate": "2018-08-07 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00561",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2022-06-07 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00563",
    "machineName": "Mesin Jarum 1 S7100A",
    "brand": "Brother",
    "purchaseDate": "2020-07-13 00:00:00",
    "location": "TW38",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00422",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2024-12-04 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00423",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2024-12-04 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00438",
    "machineName": "Mesin Blind Stitch NS-160-20",
    "brand": "Nissin",
    "purchaseDate": "2025-05-14 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Blind Tack"
  },
  {
    "inventoryNo": "TW-MPP-00599",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00522",
    "machineName": "MESIN HEAT PRESS ROLL",
    "brand": "Phoenix",
    "purchaseDate": "-",
    "location": "TW38",
    "madeIn": "Germany",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00516",
    "machineName": "KOMPRESOR 15hp",
    "brand": "Shark",
    "purchaseDate": "2023-01-11 00:00:00",
    "location": "TW1",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00032",
    "machineName": "KAPASITOR BANK",
    "brand": "Shizuki",
    "purchaseDate": "2019-07-03 00:00:00",
    "location": "TW1",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00087",
    "machineName": "MESIN Ban Karet SIRUBA",
    "brand": "Siruba",
    "purchaseDate": "2016-07-03 00:00:00",
    "location": "TW1",
    "madeIn": "Taiwan",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Kansai 7/8+Cr"
  },
  {
    "inventoryNo": "TW-MPP-00519",
    "machineName": "GENSET 300KVA",
    "brand": "Suntek",
    "purchaseDate": "2023-01-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00589",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2023-04-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00592",
    "machineName": "Mesin Obras MO-6816D JUKI",
    "brand": "Juki",
    "purchaseDate": "2025-03-14 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00117",
    "machineName": "Meja Gosok Suesei",
    "brand": "Susei",
    "purchaseDate": "2020-03-01 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00123",
    "machineName": "KOMPRESOR 10HP",
    "brand": "Swan",
    "purchaseDate": "2016-03-01 00:00:00",
    "location": "TW1",
    "madeIn": "Taiwan",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00520",
    "machineName": "KOMPRESOR 10HP",
    "brand": "Swan",
    "purchaseDate": "2023-01-01 00:00:00",
    "location": "TW38",
    "madeIn": "Taiwan",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00521",
    "machineName": "KOMPRESOR 5HP",
    "brand": "Swan",
    "purchaseDate": "2016-03-01 00:00:00",
    "location": "TW38",
    "madeIn": "Taiwan",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00513",
    "machineName": "Mesin Obras GN-795",
    "brand": "Typical",
    "purchaseDate": "2009-04-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00601",
    "machineName": "Mesin Khusus Lipatan Heming Bedoly",
    "brand": "Bedoly",
    "purchaseDate": "2024-03-28 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Overdeck"
  },
  {
    "inventoryNo": "TW-MPP-00602",
    "machineName": "Mesin Obras Benang 5 HIKARI",
    "brand": "Hikari",
    "purchaseDate": "2024-03-28 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 4 + Cr"
  },
  {
    "inventoryNo": "TW-MPP-00603",
    "machineName": "Mesin Side CutterH99S",
    "brand": "Hikari",
    "purchaseDate": "2024-03-28 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SC"
  },
  {
    "inventoryNo": "TW-MPP-00722",
    "machineName": "Mesin Bobok kantong APW-895N",
    "brand": "Juki",
    "purchaseDate": "2023-04-05 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "APW"
  },
  {
    "inventoryNo": "TW-MPP-00607",
    "machineName": "Mesin Soom JC 9330-0",
    "brand": "Brother",
    "purchaseDate": "2024-05-29 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Soom"
  },
  {
    "inventoryNo": "TW-MPP-00608",
    "machineName": "Mesin Potong Mika & Carton FT1512",
    "brand": "Sinajet",
    "purchaseDate": "2024-05-29 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00609",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00610",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00612",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00613",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00614",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00615",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00616",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00617",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00618",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00619",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00620",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00621",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00622",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00623",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00624",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00625",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00626",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00597",
    "machineName": "Mesin ObrasGN-795",
    "brand": "Typical",
    "purchaseDate": "2009-04-01 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00629",
    "machineName": "Mesin Press NS-450MS",
    "brand": "Nissin",
    "purchaseDate": "2024-12-04 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00630",
    "machineName": "Auto Cut J-wei CB03II-2516-RQ",
    "brand": "J-Wei",
    "purchaseDate": "2024-12-24 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00631",
    "machineName": "Auto Cut J-wei CB03II-2516-RQ/Projectors",
    "brand": "J-Wei",
    "purchaseDate": "2024-12-24 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00632",
    "machineName": "Bobok Laser Jooke JKT-3520-FA-HQ",
    "brand": "Jooke",
    "purchaseDate": "2024-12-04 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00633",
    "machineName": "Mesin Tamplate JKC-NS2-13095-LM-XH",
    "brand": "Jooke",
    "purchaseDate": "2024-12-04 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00634",
    "machineName": "Mesin Band Knife-BK900B",
    "brand": "Nissin",
    "purchaseDate": "2024-12-04 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00543",
    "machineName": "Mesin Autocutt Yuanyi",
    "brand": "Yuanyi",
    "purchaseDate": "2025-04-19 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00636",
    "machineName": "Mesin Lubang Kancing  HE-800C-2",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00637",
    "machineName": "Mesin Bartack Brother KE-430HS-03",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bartack"
  },
  {
    "inventoryNo": "TW-MPP-00638",
    "machineName": "Mesin Pasang Kancing Brother BE-438HS",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Pasang Kancing"
  },
  {
    "inventoryNo": "TW-MPP-00639",
    "machineName": "Mesin Bartack Brother KE-430HS-03",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Bartack"
  },
  {
    "inventoryNo": "TW-MPP-00640",
    "machineName": "Mesin Jarum 2 Brother T-8450C-003",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00641",
    "machineName": "Mesin Jarum 2 Brother T-8450C-003",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00642",
    "machineName": "Mesin Jarum 2 Brother T-8450C-003",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00643",
    "machineName": "Mesin Ban Karet (Kansai Plaket) DFB1404PMD",
    "brand": "Kansai sp",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Kansai 7/8+Cr"
  },
  {
    "inventoryNo": "TW-MPP-00644",
    "machineName": "Mesin Ban Karet (Kansai Plaket) DFB1404PMD",
    "brand": "Kansai sp",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW1",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Kansai 7/8+Cr"
  },
  {
    "inventoryNo": "TW-MPP-00645",
    "machineName": "Mesin Ban Karet (Kansai Plaket) DFB1404PMD",
    "brand": "Kansai sp",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "Jepang",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Kansai 7/8+Cr"
  },
  {
    "inventoryNo": "TW-MPP-00646",
    "machineName": "Mesin Jarum 2 Brother T-8450C-003",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00647",
    "machineName": "Mesin Lubang Kancing HE-800C-2",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Button Holer"
  },
  {
    "inventoryNo": "TW-MPP-00648",
    "machineName": "Mesin Pasang Kancing Brother BE-438HS",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Pasang Kancing"
  },
  {
    "inventoryNo": "TW-MPP-00574",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00650",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00506",
    "machineName": "Mesin Gurinda duduk",
    "brand": "domax",
    "purchaseDate": "2025-08-07 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00652",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00653",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00654",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00655",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00656",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00657",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00658",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00659",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00660",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00661",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00662",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00663",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00664",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00665",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00666",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00667",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00668",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00669",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00670",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00671",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00673",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-12-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00674",
    "machineName": "Boiler Gas EH 500KH",
    "brand": "-",
    "purchaseDate": "2024-11-20 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00688",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00689",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00690",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00691",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00692",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00693",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00694",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00695",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00696",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00697",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2025-04-09 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00698",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2024-12-04 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00699",
    "machineName": "Meja Gosok Nissin",
    "brand": "Nissin",
    "purchaseDate": "2024-12-04 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Ironning"
  },
  {
    "inventoryNo": "TW-MPP-00700",
    "machineName": "Mesin Jarum 1  S7180A",
    "brand": "Brother",
    "purchaseDate": "2024-08-30 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00702",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00712",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00713",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00714",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00715",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00716",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00717",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00718",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00719",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00720",
    "machineName": "ALAT PASANG BENANG",
    "brand": "JING JIU JIANG",
    "purchaseDate": "2025-02-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Threader"
  },
  {
    "inventoryNo": "TW-MPP-00794",
    "machineName": "Mesin jarum 1 S7100a",
    "brand": "Brother",
    "purchaseDate": "-",
    "location": "TW1",
    "madeIn": "Vietnam",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00721",
    "machineName": "Alat Pindah barang",
    "brand": "-",
    "purchaseDate": "2026-03-16 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00497",
    "machineName": "SMART PULLER LM-DGS",
    "brand": "LUMINO",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "CHINA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00596",
    "machineName": "SMART PULLER LM-DGS",
    "brand": "LUMINO",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00495",
    "machineName": "SMART PULLER LM-DGS",
    "brand": "LUMINO",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "CHINA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00494",
    "machineName": "SMART PULLER LM-DGS",
    "brand": "LUMINO",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "CHINA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00493",
    "machineName": "SMART PULLER LM-DGS",
    "brand": "LUMINO",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "CHINA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00492",
    "machineName": "SMART PULLER LM-DGS",
    "brand": "LUMINO",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00491",
    "machineName": "SMART PULLER LM-DGS",
    "brand": "LUMINO",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "CHINA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00490",
    "machineName": "SMART PULLER LM-DGS",
    "brand": "LUMINO",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "CHINA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00489",
    "machineName": "SMART PULLER LM-DGS",
    "brand": "LUMINO",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "CHINA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00480",
    "machineName": "Mesin Pasang Tangan",
    "brand": "Durkop Adler",
    "purchaseDate": "2025-05-08 00:00:00",
    "location": "TW38",
    "madeIn": "german",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00571",
    "machineName": "Mesin Pasang Tangan",
    "brand": "Durkop Adler",
    "purchaseDate": "2025-12-01 00:00:00",
    "location": "TW1",
    "madeIn": "German",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "-",
    "machineName": "UMUM",
    "brand": "-",
    "purchaseDate": "-",
    "location": "LAINNYA",
    "madeIn": "-",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00481",
    "machineName": "Mesin obras HX8VII-16-03C",
    "brand": "Hikari",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00482",
    "machineName": "Mesin obras HX8VII-16-03C",
    "brand": "Hikari",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00485",
    "machineName": "Mesin obras HX8VII-16-03C",
    "brand": "Hikari",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00488",
    "machineName": "Mesin obras HX8VII-16-03C",
    "brand": "Hikari",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00487",
    "machineName": "Mesin obras HX8VII-16-03C",
    "brand": "Hikari",
    "purchaseDate": "2026-04-29 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "OL 3"
  },
  {
    "inventoryNo": "TW-MPP-00484",
    "machineName": "Mesin Cuci Sharp ES-M8000P",
    "brand": "SHARP",
    "purchaseDate": "2025-07-22 00:00:00",
    "location": "TW38",
    "madeIn": "-",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "TW-MPP-00451",
    "machineName": "Mesin Jarum 1 S7180A",
    "brand": "Brother",
    "purchaseDate": "2025-07-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "SN"
  },
  {
    "inventoryNo": "TW-MPP-00732",
    "machineName": "Mesin Press NS-450MS",
    "brand": "Nissin",
    "purchaseDate": "2025-11-03 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Maica"
  },
  {
    "inventoryNo": "TW-MPP-00",
    "machineName": "Mesin Printing Sublime TS-100 1600",
    "brand": "MIMAKI",
    "purchaseDate": "2023-05-05 00:00:00",
    "location": "TW38",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "INV-519",
    "machineName": "Puller Carv ATM",
    "brand": "CARV",
    "purchaseDate": "2021-01-16 00:00:00",
    "location": "LAINNYA",
    "madeIn": "-",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "INV-520",
    "machineName": "Boiler Kompor gas",
    "brand": "-",
    "purchaseDate": "2010-05-01 00:00:00",
    "location": "LAINNYA",
    "madeIn": "-",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "INV-521",
    "machineName": "Spreading Vacum Table cutting",
    "brand": "-",
    "purchaseDate": "2019-04-01 00:00:00",
    "location": "LAINNYA",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "INV-522",
    "machineName": "Spreading Vacum Table cutting",
    "brand": "-",
    "purchaseDate": "2019-04-01 00:00:00",
    "location": "LAINNYA",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "INV-523",
    "machineName": "Spreading Vacum Table cutting",
    "brand": "-",
    "purchaseDate": "2019-04-01 00:00:00",
    "location": "LAINNYA",
    "madeIn": "Indonesia",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00462",
    "machineName": "Mesin KM KS-AUV",
    "brand": "MACK",
    "purchaseDate": "-",
    "location": "TW38",
    "madeIn": "CHINA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00580",
    "machineName": "Mesin Pisau Lempar potong Gelaran NS-980D",
    "brand": "Nissin",
    "purchaseDate": "2025-03-14 00:00:00",
    "location": "TW38",
    "madeIn": "CHINA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00313",
    "machineName": "Mesin Pocket Setter M",
    "brand": "Maica",
    "purchaseDate": "2023-09-22 00:00:00",
    "location": "TW1",
    "madeIn": "china",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Pocket Setter"
  },
  {
    "inventoryNo": "INV-527",
    "machineName": "Mesin Sewing",
    "brand": "-",
    "purchaseDate": "-",
    "location": "TW38",
    "madeIn": "-",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00781",
    "machineName": "Mesin Ban Karet (Kansai Plaket) DFB1404PMD",
    "brand": "KANSAI",
    "purchaseDate": "-",
    "location": "TW38",
    "madeIn": "JEPANG",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Kansai 7/8+Cr"
  },
  {
    "inventoryNo": "TW-MPP-00773",
    "machineName": "Mesin Pisau Lempar potong Gelaran NS-980D",
    "brand": "NISSIN",
    "purchaseDate": "-",
    "location": "TW1",
    "madeIn": "JEPANG",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00774",
    "machineName": "Mesin Pisau Lempar potong Gelaran NS-980D",
    "brand": "Nissin",
    "purchaseDate": "-",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Manual"
  },
  {
    "inventoryNo": "TW-MPP-00054",
    "machineName": "Automatic AC Voltage Regulator",
    "brand": "MATSUYAMA",
    "purchaseDate": "-",
    "location": "TW1",
    "madeIn": "CHINA",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  },
  {
    "inventoryNo": "INV-532",
    "machineName": "Mesin Sewing",
    "brand": "-",
    "purchaseDate": "-",
    "location": "LAINNYA",
    "madeIn": "-",
    "condition": "Terjual",
    "availableQty": 1,
    "machineGroup": "Lain-lain"
  },
  {
    "inventoryNo": "TW-MPP-00780",
    "machineName": "MESIN SNAP F-STRONG BENHO",
    "brand": "BENHO",
    "purchaseDate": "-",
    "location": "TW1",
    "madeIn": "CHINA",
    "condition": "Rusak",
    "availableQty": 1,
    "machineGroup": "Snap Attaching"
  },
  {
    "inventoryNo": "TW-MPP-00118",
    "machineName": "Mesin Cuci Aquamagic",
    "brand": "Sharp",
    "purchaseDate": "-",
    "location": "TW1",
    "madeIn": "China",
    "condition": "Normal",
    "availableQty": 1,
    "machineGroup": "Helper"
  }
];

export interface LocationGroupSummary {
  machineGroup: string;
  displayName: string;
  totalPabrik: number;
  normalTotal: number;
  tw1Normal: number;
  tw38Normal: number;
  rusakTotal: number;
  terjualTotal: number;
}

/**
 * Standard location allocation for lines:
 * Line 1, Line 3 -> TW1
 * Line 4, Line 5, Line 6, Line 7 -> TW38
 */
export function getLineFactoryLocation(lineId: number | string): "TW1" | "TW38" {
  const lineNum = typeof lineId === "number" ? lineId : parseInt(String(lineId).replace(/\D/g, ""), 10);
  if (lineNum === 1 || lineNum === 3) {
    return "TW1";
  }
  return "TW38";
}

/**
 * Lines belonging to the same factory location
 */
export function getCoLocatedLines(lineId: number | string): number[] {
  const loc = getLineFactoryLocation(lineId);
  return loc === "TW1" ? [1, 3] : [4, 5, 6, 7];
}

/**
 * Build aggregated stock map per machine group and location
 */
export function getAggregatedMachineInventory(): Record<string, LocationGroupSummary> {
  const map: Record<string, LocationGroupSummary> = {};

  for (const item of FACTORY_MACHINE_INVENTORY_RAW) {
    const grp = item.machineGroup;
    if (!grp) continue;
    if (!map[grp]) {
      map[grp] = {
        machineGroup: grp,
        displayName: grp,
        totalPabrik: 0,
        normalTotal: 0,
        tw1Normal: 0,
        tw38Normal: 0,
        rusakTotal: 0,
        terjualTotal: 0,
      };
    }

    const qty = item.availableQty || 1;
    map[grp].totalPabrik += qty;

    if (item.condition === "Normal") {
      map[grp].normalTotal += qty;
      if (item.location === "TW1") {
        map[grp].tw1Normal += qty;
      } else if (item.location === "TW38") {
        map[grp].tw38Normal += qty;
      }
    } else if (item.condition === "Rusak") {
      map[grp].rusakTotal += qty;
    } else if (item.condition === "Terjual") {
      map[grp].terjualTotal += qty;
    }
  }

  return map;
}

/**
 * Standardize process machine type name to match inventory machineGroup key
 */
export function normalizeMachineGroupKey(machineType: string): string {
  const norm = (machineType || "").trim();
  if (/pasang\s*kancing|button\s*attaching/i.test(norm)) return "Pasang Kancing";
  if (/lubang\s*kancing|button\s*holer|buttonhole/i.test(norm)) return "Button Holer";
  if (/obras\s*corong|ol\s*4|ol\s*5/i.test(norm)) return "OL 4 + Cr";
  if (/obras|overlock|ol\s*3/i.test(norm)) return "OL 3";
  if (/kansai|ban\s*karet/i.test(norm)) return "Kansai 7/8+Cr";
  if (/bartack|bar\s*tack/i.test(norm)) return "Bartack";
  if (/soom|blindstitch/i.test(norm)) return "Soom";
  if (/make\s*up|makeup/i.test(norm)) return "Makeup";
  if (/side\s*cutter|sc/i.test(norm)) return "SC";
  if (/tandem/i.test(norm)) return "Tandem";
  if (/overdeck|interlock/i.test(norm)) return "Overdeck";
  if (/bobok|apw/i.test(norm)) return "APW";
  if (/bass/i.test(norm)) return "Bass";
  if (/single\s*needle|jarum\s*1|sn/i.test(norm)) return "SN";
  if (/jarum\s*2|dn/i.test(norm)) return "SN";
  if (/gosok|iron/i.test(norm)) return "Ironning";
  if (/manual/i.test(norm)) return "Manual";
  if (/helper/i.test(norm)) return "Helper";
  if (/threader|gulung\s*benang|pasang\s*benang/i.test(norm)) return "Threader";
  if (/snap/i.test(norm)) return "Snap Attaching";
  if (/blind\s*tack/i.test(norm)) return "Blind Tack";
  return norm;
}

/**
 * Get available normal machines for a specific line based on its factory location (TW1 or TW38).
 */
export function getAvailableStockForLine(machineGroup: string, lineId: number | string): number {
  const normKey = normalizeMachineGroupKey(machineGroup);
  const agg = getAggregatedMachineInventory();
  const summary = agg[normKey] || agg[machineGroup];
  if (!summary) return 0;
  const loc = getLineFactoryLocation(lineId);
  return loc === "TW1" ? summary.tw1Normal : summary.tw38Normal;
}

/**
 * Get total factory normal (working) machines
 */
export function getFactoryNormalStock(machineGroup: string): number {
  const normKey = normalizeMachineGroupKey(machineGroup);
  const agg = getAggregatedMachineInventory();
  const summary = agg[normKey] || agg[machineGroup];
  return summary ? summary.normalTotal : 0;
}

