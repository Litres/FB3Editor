/**
 * Абстрактная кнопка открытия файла.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.AbstractFileButton',
	{
		extend: 'Ext.form.field.FileButton',

		afterTpl: '<input id="{id}-fileInputEl" data-ref="fileInputEl" class="{childElCls} {inputCls}" ' +
		          'type="file" size="1" name="{inputName}" role="{role}" ' +
		          '<tpl if="tabIndex != null">tabindex="{tabIndex}"</tpl> ',

		/**
		 * @property {String} Допустимые mime-типы для открытия (через запятую, без пробелов).
		 */
		accept: '',

		initComponent: function ()
		{
			var me = this;

			if (me.accept)
			{
				me.afterTpl += 'accept="' + me.accept + '" ';
			}

			me.afterTpl += '>';

			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this,
				control;

			me.callParent(arguments);

			control = me.fileInputEl.dom;
			me.fileInputEl.on(
				{
					change: function (event)
					{
						Ext.defer(
							function ()
							{
								control.value = null;
							},
						    100
						);
					}
				}
			);
		}
	}
);