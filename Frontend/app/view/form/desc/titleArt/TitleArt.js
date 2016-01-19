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
			'FBEditor.view.panel.main.props.desc.arts.Arts'
		],
		controller: 'form.desc.titleArt',
		xtype: 'form-desc-titleArt',
		id: 'form-desc-title',
		cls: 'container-valid',

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

		listeners: {
			changeTitle: 'onChangeTitle',
			blurTitle: 'onBlurTitle',
			focusTitle: 'onFocusTitle',
			cleanResultContainer: 'onCleanResultContainer'
		},

		afterRender: function ()
		{
			var me = this,
				resultContainer = me.getResultContainer(),
				artsContainer = resultContainer.getPanelArts();

			me.callParent(arguments);

			// сбрасываем названия, сохраненные в локальном хранилище
			me.fireEvent('cleanResultContainer');

			artsContainer.on(
				{
					scope: this,
					afterLoad: me.afterLoad
				}
			)
		},

		/**
		 * Возвращает контейнер для отображения результатов поиска.
		 * @return {FBEditor.view.panel.main.props.desc.arts.Arts}
		 */
		getResultContainer: function ()
		{
			var bridge = FBEditor.getBridgeProps();

			return bridge.Ext.getCmp('props-desc-arts');
		},

		/**
		 * Возвращает контейнер для отображения персон.
		 * @return {FBEditor.view.panel.main.props.desc.persons.Persons}
		 */
		getPersonsContainer: function ()
		{
			var bridge = FBEditor.getBridgeProps();

			return bridge.Ext.getCmp('props-desc-persons');
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