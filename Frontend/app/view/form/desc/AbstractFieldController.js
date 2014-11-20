/**
 * Абстрактный контроллер контейнера для полей формы описания книги.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.AbstractFieldController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.abstractField',

		/**
		 * Загружает данные в поля.
		 * @param {Object} data Данные, полученные из книги.
		 */
		onLoadData:  function (data)
		{

		},

		/**
		 * Сбрасывает поля формы.
		 */
		onResetFields: function ()
		{
			var me = this;

			me.resetContainer();
		},

		/**
		 * @private
		 * Удаляет все клонированные поля.
		 */
		resetContainer: function ()
		{
			var me = this,
				view = me.getView(),
				containers,
				childContainers;

			containers = view.query('[name=plugin-fieldcontainerreplicator]');
			 Ext.each(
				containers,
				function (item, index)
				{
					if (index)
					{
						// удаляем все поля кроме первого контенейра
						view.remove(item);
					}
					else
					{
						// удаляем вложенные контейнеры первого контенейра
						childContainers = item.query('[name=plugin-fieldcontainerreplicator]');
						Ext.each(
							childContainers,
							function (itemContainer, indexContainer)
							{
								item.remove(itemContainer);
							}
						);
						item.query('button[name=fieldcontainerreplicator-btn-remove]')[0].disable();
					}
				}
			);
		}
	}
);