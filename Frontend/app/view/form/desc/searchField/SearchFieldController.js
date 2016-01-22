/**
 * Контроллер поле поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.searchField.SearchFieldController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.searchField',

		/**
		 * @abstract
		 * Вызывается при выборе записи из списка.
		 * @param {Object} data Данные.
		 */
		onSelect: function (data)
		{
			throw Error('Необходимо определить метод' +
			            ' FBEditor.view.form.desc.searchField.SearchFieldController#onSelect()');
		},

		/**
		 * Вызывается после рендеринга поля.
		 */
		onAfterRender: function ()
		{
			var me = this,
				view = me.getView(),
				win = view.getWindow(),
				containerItems = view.getContainerItems();

			// обрабатываем esc в поле ввода
			view.keyNav = new Ext.util.KeyNav(
				{
					target: view.inputEl,
					scope: win,
					esc: function ()
					{
						this.onEsc();
					}
				}
			);

			// устанавливаем обработчик загрузки данных
			containerItems.on(
				{
					scope: view,
					afterLoad: view.afterLoad
				}
			);
		},

		/**
		 * Вызывается при клике по полю.
		 */
		onClick: function (e, input)
		{
			var me = this,
				view = me.getView(),
				win = view.getWindow(),
				val;

			// останавливаем всплытие события, чтобы не допустить закрытия окна
			e.stopPropagation();

			val = view.getValue();

			if (val)
			{
				// показываем список, если значение не пустое
				if (!win.isShow)
				{
					win.show();
				}
			}
			else
			{
				// при пустом поле показываем список, сохраненный локально
				view.expandStorage();
			}
		},

		/**
		 * Вызывается при изменении данных в поле.
		 */
		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				win = view.getWindow();

			win.clean();
			view.search();
		},

		/**
		 * Возвращает плагин fieldcontainerreplicator.
		 * @return {FBEditor.ux.FieldContainerReplicator}
		 */
		getPlugin: function ()
		{
			var me = this,
				view = me.getView(),
				plugin;

			plugin = view.up('[plugins]').getPlugin('fieldcontainerreplicator');

			return plugin;
		}
	}
);