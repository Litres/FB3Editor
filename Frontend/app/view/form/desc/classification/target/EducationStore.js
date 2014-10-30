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
				value: 'none',
				name: ''
			},
			{
				value: 'primary',
				name: ''
			},
			{
				value: 'high',
				name: ''
			},
			{
				value: 'specialized_secondary',
				name: ''
			},
			{
				value: 'higher',
				name: ''
			},
			{
				value: 'specialized_higher',
				name: ''
			}
		]
	}
);