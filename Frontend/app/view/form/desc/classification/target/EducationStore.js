/**
 * Хранилище списка типов образований целевой аудетории.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.target.EducationStore',
	{
		extend: 'Ext.data.Store',
		fields: [
			'value',
			'name'
		],
		data: [
			{
				value: 'none', name: 'без образования'
			},
			{
				value: 'preschool_education', name: 'дошкольное образование'
			},
			{
				value: 'primary_education', name: 'начальное общее образование'
			},
			{
				value: 'basic_education', name: 'основное общее'
			},
			{
				value: 'secondary_education', name: 'среднее (полное) общее'
			},
			{
				value: 'technical_school_first_cycle', name: 'начальное профессиональное'
			},
			{
				value: 'technical_school_second_cycle', name: 'среднее профессиональное'
			},
			{
				value: 'higher_education', name: 'высшее профессиональное'
			},
			{
				value: 'university_postgraduate', name: 'послевузовское профессиональное'
			},
			{
				value: 'vocational_training', name: 'профессиональная подготовка'
			},
			{
				value: 'additional_education', name: 'дополнительное образование'
			}
		]
	}
);