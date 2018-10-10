/**
 * Поле ссылки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.field.link.Link',
	{
		extend: 'Ext.form.Display',
		xtype: 'form-desc-field-link',

		fieldSubTpl: [
			'<div id="{id}" role="{role}" {inputAttrTpl}',
			'<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
			' class="{fieldCls} {fieldCls}-{ui}">{value}</div>',
			{
				compiled: true,
				disableFormats: true
			}
		],

		/**
		 * @property {String} Шаблон ссылки.
		 */
		linkTpl: '<a href="{href}" target="_blank" title="{title}">{value}</a>',

		/**
		 * @private
		 * @property {Boolean} Деактивировать ли ссылку.
		 */
		_disableLink: true,

		/**
		 * Деактивирует ссылку, показывая вместо нее текст.
		 * @param {Boolean} disable Деактивировать.
		 */
		disableLink: function (disable)
		{
			var me = this,
				value = me.getRawValue();

			me._disableLink = arguments.length ? disable : true;

			me.setValue(value);
		},

		/**
		 * Переписывает стандартный метод отображния значения.
		 */
		getDisplayValue: function()
		{
			var me = this,
				value = me.getRawValue(),
				display;

			if (me.renderer)
			{
				display = me.renderer.call(me.scope || me, value, me);
			}
			else
			{
				display = me._disableLink ? value :
				          new Ext.XTemplate(me.linkTpl).apply(
					          {
						          href: value,
						          value: value,
						          title: ''
					          }
				          );
			}

			return display;
		}
	}
);