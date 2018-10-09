/**
 * Панель свойств редактора описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.Desc',
	{
		extend: 'FBEditor.view.panel.main.props.Abstract',
		requires: [
			'FBEditor.view.panel.main.props.desc.DescController',
			'FBEditor.view.panel.main.props.desc.editor.Container',
			'FBEditor.view.panel.main.props.desc.search.arts.Arts',
			'FBEditor.view.panel.main.props.desc.search.persons.Persons'
		],

		id: 'panel-props-desc',
		xtype: 'panel-props-desc',
		controller: 'panel.props.desc',

		listeners: {
			showContainer: 'onShowContainer'
		},

		/**
		 * @property {String[]} Список контейнеров, один из которых может быть показан на панели свойств, а остальные
		 * из этого списка должны быть скрыты
		 */
		containerList: [
			'panel-props-desc-editor-container',
			'props-desc-search-arts',
			'props-desc-search-persons'
		],

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-props-desc-editor-container'
				},
				{
					xtype: 'props-desc-search-arts'
				},
				{
					xtype: 'props-desc-search-persons'
				}
			];

			me.callParent(arguments);
		},

		getContentId: function ()
		{
			return 'form-desc';
		}
	}
);