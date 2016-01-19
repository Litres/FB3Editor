/**
 * Текстовое поле для фамилии/имени/отчества.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.name.Name',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.form.desc.relations.subject.name.NameController'
		],
		controller: 'form.desc.relations.subject.name',
		xtype: 'form-desc-relations-subject-name',
		checkChangeBuffer: 200,
		plugins: {
			ptype: 'searchField',
			style: 'right: 2px'
		},

		/**
		 * @private
		 * @property {Ext.form.field.Text} Поле "Стандартное написание".
		 */
		titleMain: null,

		listeners: {
			change: 'onChange',
			focus: 'onFocus',
			afterrender: 'onAfterRender',
			cleanResultContainer: 'onCleanResultContainer'
		},

		/**
		 * Возвращает поле "Стандартное написание".
		 * @return {FBEditor.view.form.desc.relations.subject.title.Title}
		 */
		getTitle: function ()
		{
			var me = this,
				titleMain;

			titleMain = me.titleMain ||
			            me.up('desc-fieldcontainer').
				            up('desc-fieldcontainer').
				            down('form-desc-relations-subject-title');

			return titleMain;
		},

		/**
		 * Возвращает контейнер для отображения результатов поиска.
		 * @return {FBEditor.view.panel.main.props.desc.persons.Persons}
		 */
		getResultContainer: function ()
		{
			var bridge = FBEditor.getBridgeProps();

			return bridge.Ext.getCmp('props-desc-persons');
		},

		/**
		 * Возвращает контейнер для отображения произведений.
		 * @return {FBEditor.view.panel.main.props.desc.arts.Arts}
		 */
		getArtsContainer: function ()
		{
			var bridge = FBEditor.getBridgeProps();

			return bridge.Ext.getCmp('props-desc-arts');
		},

		/**
		 * @private
		 * Вызывается после загрузки данных.
		 * @param {Array} data Данные.
		 */
		afterLoad: function (data)
		{
			var me = this,
				plugin;

			plugin = me.getPlugin('searchField');

			if (data)
			{
				// скрываем индикатор загрузки
				plugin.hideLoader();
			}
			else
			{
				// меняем индикатор
				plugin.emptyLoader();
			}
		}
	}
);