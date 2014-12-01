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
				name: 'none'
			},
			{
				value: 'primary',
				name: 'primary'
			},
			{
				value: 'high',
				name: 'high'
			},
			{
				value: 'specialized_secondary',
				name: 'specialized_secondary'
			},
			{
				value: 'higher',
				name: 'higher'
			},
			{
				value: 'specialized_higher',
				name: 'specialized_higher'
			}
		]
	}
);