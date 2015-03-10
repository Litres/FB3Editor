/**
 * Хранилище списка минимальных возрастов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.target.ageMin.AgeMinStore',
	{
		extend: 'Ext.data.Store',
		fields: [
			'value',
			'name'
		],
		data: [
			{
				value: '0',
				name: '0'
			},
			{
				value: '6',
				name: '6'
			},
			{
				value: '12',
				name: '12'
			},
			{
				value: '16',
				name: '16'
			},
			{
				value: '18',
				name: '18'
			},
			{
				value: '21',
				name: '21'
			}
		]
	}
);