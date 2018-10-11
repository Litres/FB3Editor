/**
 * Контроллер панели отображения ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.view.ResourcesViewController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.view.resources',

		/**
		 * Показывает свойства выбранного ресурса.
		 * @param {Ext.selection.Model} model
		 * @param {Ext.data.Model} oldFocused Данные ресурса, с которого перемистился фокус.
		 * @param {Ext.data.Model} newFocused Данные выбранного ресурса.
		 */
		onFocusChange: function (model, oldFocused, newFocused)
		{
			var me = this,
				bridgeProps = FBEditor.getBridgeProps(),
				panel;

			panel = bridgeProps.Ext.getCmp('panel-props-resources');
			if (panel && panel.fireEvent)
			{
				panel.fireEvent('loadData', newFocused);
			}
		},

		/**
		 * Открывает папку с ресурсами.
		 * @param {FBEditor.view.panel.resources.view.ResourcesView} view Панель отображения.
		 * @param {Ext.data.Model} record Данные папки.
		 */
		onItemDblClick: function (view, record)
		{
			var me = this,
				data = record.getData(),
				bridge = FBEditor.getBridgeWindow();
			
			if (data.isFolder)
			{
				bridge.FBEditor.resource.Manager.restoreActiveFolder(data.name);
			}
		},

		/**
		 * Выбирает ресурс по клику.
		 * @param {FBEditor.view.panel.resources.view.ResourcesView} view Панель отображения.
		 * @param {Ext.data.Model} record Данные папки.
		 */
		onItemClick: function (view, record)
		{
			var me = this,
				data = record.getData(),
				bridge = FBEditor.getBridgeWindow(),
				selectFunction;

			if (!data.isFolder && (selectFunction = bridge.FBEditor.resource.Manager.getSelectFunction()))
			{
				// вызываем колбэк-функцию выбора ресурса
				selectFunction(data);
			}
		},

        /**
		 * Вызывается при нажатии клавиши.
         * @param view
         * @param record
         * @param item
         * @param index
         * @param e
         * @param eOpts
         */
        onItemKeyDown: function (view, record, item, index, e, eOpts)
		{
			var me = this;

            e.stopPropagation();

            switch (e.keyCode)
            {
                case Ext.event.Event.DELETE:
                    return me.onItemKeyDownDelete(view, record, item, index, e, eOpts);
            }
		},

        /**
		 * Вызывается при нажатии клавиши DEL.
         * @param view
         * @param record
         * @param item
         * @param index
         * @param e
         * @param eOpts
         */
        onItemKeyDownDelete: function (view, record, item, index, e, eOpts)
		{
			var me = this,
				panel = view.getPanelResources(),
				btnDel;

			// вызываем событие нажатия кнопки удаления
            btnDel = panel.getButtonDeleteResource();
			btnDel.fireEvent('click');
		}
	}
);