/**
 * ’ранилище списка возможных единиц измерений.
 *
 * @author samik3k@gmail.ru <Sokolov Alexander aka Sam3000>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.sizeselect.Store',
	{
		extend: 'Ext.data.Store',
		sorters: [
			{
				property: 'text',
				direction: 'ASC'
			}
		],
		fields: [
			'value',
			'text'
		],
		data: [
			{
				value: 'em',
				text: 'em'
			},
			{
				value: 'ex',
				text: 'ex'
			},
			{
				value: '%',
				text: '%'
			},
			{
				value: 'mm',
				text: 'mm'
			}
		]
	}
);