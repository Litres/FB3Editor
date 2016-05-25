/**
 * Контроллер виджета выбора размерности таблицы..
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.size.PickerController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.toolstab.main.button.table.menu.size',

		/**
		 * Вызывается при наведении курсора на ячейку.
		 * @param {Array} cell Ячейка.
		 */
		onMouseOverCell: function (cell)
		{
			var me = this,
				view = me.getView();

			view.setActiveCell(cell);
		},

		/**
		 * Вызывается при клике по ячейке.
		 * @param {Array} size Размерность таблицы.
		 */
		onClickCell: function (size)
		{
			var me = this,
				view = me.getView(),
				manager = FBEditor.getEditorManager();

			// создаем таблицу
			manager.createElement('table', {size: size});

			// закрываем меню
			view.up('panel-toolstab-main-button-table-menu').hide();
		}
	}
);