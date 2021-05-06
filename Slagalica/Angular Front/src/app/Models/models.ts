export class SectionDto
{
    SectionID: number;
    ChecklistSectionTypeID: number;
    SectionCompleted: boolean;
    CustomLabel: string;
    IsAdditional: boolean;
    Fields: FieldDto[];
}

export class FieldDto{
    FieldID: number;
    FieldTypeID: number;
    FieldValue: any;
    CustomLabel: string;
    IsAutoMap: boolean;
    AutoMapFieldName: string;
}