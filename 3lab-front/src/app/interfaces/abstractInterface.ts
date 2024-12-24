import { DataItem } from "./dataItemInterface";

export interface Abstract {
    sentenceExtraction: DataItem[],
    keywordsExtraction: DataItem[]
}