/**
 * Название произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.titleArt.TitleArt',
	{
		extend: 'FBEditor.view.form.desc.title.Title',
		requires: [
			'FBEditor.view.form.desc.titleArt.TitleArtController',
			'FBEditor.view.panel.main.props.desc.search.arts.Arts'
		],
		controller: 'form.desc.titleArt',
		xtype: 'form-desc-titleArt',
		id: 'form-desc-title',
		cls: 'container-valid',

		listeners: {
			changeTitle: 'onChangeTitle',
			blurTitle: 'onBlurTitle',
			focusTitle: 'onFocusTitle',
			cleanResultContainer: 'onCleanResultContainer'
		},

		/**
		 * @property {Boolean} Необходимо ли показывать подзаголовок.
		 */
		enableSub: true,

		/**
		 * @property {Boolean} Необходимо ли показывать альтернативное название.
		 */
		enableAlt: true,

		mainConfig: {
			plugins: {
				ptype: 'searchField',
				style: 'right: 2px'
			}
		},

		afterRender: function ()
		{
			var me = this,
				resultContainer = me.getResultContainer(),
				containerItems = resultContainer.getContainerItems();

			me.callParent(arguments);

			// сбрасываем названия, сохраненные в локальном хранилище
			me.fireEvent('cleanResultContainer');

			containerItems.on(
				{
					scope: this,
					afterLoad: me.afterLoad
				}
			)
		},

		/**
		 * Возвращает контейнер для отображения результатов поиска.
		 * @return {Ext.container}
		 */
		getResultContainer: function ()
		{
			var bridge = FBEditor.getBridgeProps();

			return bridge.Ext.getCmp('props-desc-search-arts');
		},

		/**
		 * Возвращает контейнер для отображения персон.
		 * @return {FBEditor.view.panel.main.props.desc.persons.Persons}
		 */
		getPersonsContainer: function ()
		{
			var bridge = FBEditor.getBridgeProps();

			return bridge.Ext.getCmp('props-desc-search-persons');
		},

		/**
		 * @private
		 * Вызывается после загрузки данных.
		 * @param {Array} data Данные.
		 */
		afterLoad: function (data)
		{
			var me = this,
				input = me.getMain(),
				plugin;

			plugin = input.getPlugin('searchField');

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