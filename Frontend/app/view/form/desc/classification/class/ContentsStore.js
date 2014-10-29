/**
 * Хранилище списка типов содержимого литературной формы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.class.ContentsStore',
	{
		extend: 'Ext.data.Store',
		fields: [
			'value',
			'name'
		],
		data: [
			{
				value: 'standalone',
				name: ''
			},
			{
				value: 'part',
				name: ''
			},
			{
				value: 'collection',
				name: ''
			}
		]
	}
);