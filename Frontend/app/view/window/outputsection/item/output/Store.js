/**
 * Хранилище компонента output.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.window.outputsection.item.output.Store',
	{
		extend: 'Ext.data.Store',
		
		fields: [
			'value',
			'text'
		],
		
		data: [
			{value: 'default', text: 'default'},
			{value: 'trial', text: 'trial'},
			{value: 'trial-only', text: 'trial-only'},
			{value: 'payed', text: 'payed'}
		]
	}
);