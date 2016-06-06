/**
 * Абстрактный контроллер блока fieldset для формы описания книги.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.AbstractFieldsetController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.desc.fieldset',

		/**
		 * Проверяет раскрыты ли необязательные блоки, если в них присутствуют данные.
		 * Если данные присутствуют, а блоки свернуты, то блоки раскрываются.
		 */
		onCheckExpand: function ()
		{
			var me = this,
				view = me.getView(),
				field,
				req,
				autoExpand;

			req = view.require;
			autoExpand = view.autoExpand;

			// первое поле блока всегда должно содержать свойство allowBlank
			field = view.down('component[allowBlank/="true|false"]');

			if (!req && autoExpand)
			{
				if (field && field.getValue())
				{
					view.expand();
				}
			}
		},

		/**
		 * Сбрасывает fieldset формы.
		 */
		onResetFields: function ()
		{
			var me = this;

			me.resetFieldset();
		},

		/**
		 * @private
		 * Сворачивает или разворачивает блоки fieldset, в зависимости от их обязательного заполнения.
		 */
		resetFieldset: function ()
		{
			var me = this,
				view = me.getView(),
				req,
				autoExpand;

			req = view.require;
			autoExpand = view.autoExpand;
			/*if (view.getXType() === 'desc-fieldsetinner')
			{*/
				if (req && autoExpand)
				{
					view.expand();
				}
				else
				{
					view.collapse();
				}
			/*}
			else
			{
				view.expand();
			}*/
		}
	}
);