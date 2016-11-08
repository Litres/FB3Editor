/**
 * Контроллер панели свойств ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.resources.ResourcesController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.props.resources',

		/**
		 * @private
		 * @property {Number} Айди таймера отложенного скрытия элементов панели
		 */
		_deferId: null,

		/**
		 * Вызывается при клике по панели.
		 */
		onClick: function ()
		{
			var me = this;

			// сбрасываем таймер отложенного скрытия элементов панели при клике по панели
			clearTimeout(me._deferId);
		},

		/**
		 * Отображает свойства выбранного ресурса.
		 * @param {Ext.data.Model} record Данные выбранного ресурса.
		 */
		onLoadData: function (record)
		{
			var me = this,
				data = record ? record.getData() : null,
				bridgeProps = FBEditor.getBridgeProps();

			if (data)
			{
				bridgeProps.Ext.getCmp('props-resources-info').update(data);
				me.setResourceButtons(data.name);
				me.setVisibleItems(true);
				if (data.isFolder)
				{
					// папки не могут иметь кнопку сохранения и пермещения
					bridgeProps.Ext.getCmp('button-save-resource').setVisible(false);
					bridgeProps.Ext.getCmp('button-move-resource').setVisible(false);
				}
			}
			else
			{
				// устанавливаем таймер отложенного скрытия элементов панели
				me._deferId = Ext.defer(
					function ()
					{
						me.setVisibleItems(false);
						me.setResourceButtons(null);
					},
					200
				);
			}
		},

		/**
		 * @private
		 * Устанавливает видимость дочерних компонентов панели свойств.
		 * @param {Boolean} visible Отображать ли дочерние компоненты.
		 */
		setVisibleItems: function (visible)
		{
			var me = this,
				view = me.getView(),
				items = view.items;

			items.each(
				function (item)
				{
					item.setVisible(visible);
				}
			);
		},

		/**
		 * Связывает кнопки управления с ресурсом.
		 * @param {String|null} data Имя ресурса.
		 */
		setResourceButtons: function (data)
		{
			var buttons,
				bridgeProps = FBEditor.getBridgeProps();

			if (bridgeProps.Ext && bridgeProps.Ext.getCmp)
			{
				buttons = [
					bridgeProps.Ext.getCmp('button-delete-resource'),
					bridgeProps.Ext.getCmp('button-save-resource'),
					bridgeProps.Ext.getCmp('button-move-resource')
				];
				
				Ext.Array.each(
					buttons,
					function (item)
					{
						item.setResource(data);
					}
				);
			}
		}
	}
);