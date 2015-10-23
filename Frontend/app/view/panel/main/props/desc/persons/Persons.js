/**
 * Контейнер с результатами поиска персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.persons.Persons',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.panel.main.props.desc.persons.PersonsController',
			'FBEditor.view.panel.persons.Persons'
		],
		controller: 'props.desc.persons',
		xtype: 'props-desc-persons',
		id: 'props-desc-persons',

		listeners: {
			loadData: 'onLoadData'
		},

		/**
		 * @property {FBEditor.view.panel.persons.Persons} Панель персон.
		 */
		panelPersons: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-persons'
				}
			];

			me.callParent(arguments);
		},

		/**
		 * Удаляет все данные из контейнера.
		 */
		clean: function ()
		{
			var me = this,
				panel;

			panel = me.getPanelPersons();
			panel.clean();
		},

		/**
		 * Возвращает панель персон.
		 * @return {FBEditor.view.panel.persons.Persons}
		 */
		getPanelPersons: function ()
		{
			var me = this,
				panel;

			panel = me.panelPersons || me.down('panel-persons');

			return panel;
		}
	}
);