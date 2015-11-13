/**
 * Привязка клавиатурных сочетаний.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.KeyMap',
	{
		singleton: true,

		/**
		 * @property {Array} Карта соответствия клавиш.
		 */
		map: [
			{
				key: 'B',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'strong'
				}
			},
			{
				key: 'D',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'div'
				}
			},
			{
				key: 'E',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'epigraph'
				}
			},
			{
				key: 'H',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'title'
				}
			},
			{
				key: 'I',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'em'
				}
			},
			{
				key: 'I',
				ctrl: true,
				shift: true,
				fn: 'onBtn',
				args: {
					name: 'spacing'
				}
			},
			{
				key: 'L',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'a'
				}
			},
			{
				key: 'M',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'pre'
				}
			},
			{
				key: 'N',
				ctrl: true,
				alt: true,
				fn: 'onBtn',
				args: {
					name: 'note'
				}
			},
			{
				key: 'P',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'img'
				}
			},
			{
				key: 'Q',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'blockquote'
				}
			},
			{
				key: 'S',
				ctrl: true,
				shift: true,
				fn: 'onBtn',
				args: {
					name: 'section'
				}
			},
			{
				key: 'U',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'underline'
				}
			},
			{
				key: 'X',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'sub'
				}
			},
			{
				key: 'X',
				ctrl: true,
				shift: true,
				fn: 'onBtn',
				args: {
					name: 'sup'
				}
			}
		],

		/**
		 * Нажатие клавиши.
		 * @param {Event} e Объект события.
		 */
		key: function (e)
		{
			var me = this,
				map = me.map;

			//console.log(e);

			Ext.Array.each(
				map,
			    function (cfg)
			    {
				    if (Ext.event.Event[cfg.key] && e.keyCode === Ext.event.Event[cfg.key])
				    {
					    me.executeFn(e, cfg);
				    }
			    }
			);
		},

		/**
		 * @private
		 * Проверяет конфиг и выполняет функцию.
		 * @param {Event} e Объект события.
		 * @param {Object} cfg Конфиг клавиши.
		 */
		executeFn: function (e, cfg)
		{
			var me = this,
				args;

			if (e.ctrlKey && cfg.ctrl && !e.shiftKey && !cfg.shift ||
			    e.shiftKey && cfg.shift && !e.ctrlKey && !cfg.ctrl ||
			    e.shiftKey && cfg.shift && e.ctrlKey && cfg.ctrl ||
			    !e.ctrlKey && !cfg.ctrl && !e.shiftKey && !cfg.shift)
			{
				e.preventDefault();

				// выполяняем функцию
				if (cfg.fn && me[cfg.fn])
				{
					args = cfg.args || {};
					args.e = e;
					me[cfg.fn](args);
				}
			}
		},

		/**
		 * @private
		 * Выполняет нажатие кнопки на панели форматирования.
		 * @param args
		 * @param {String} args.name Имя кнопки.
		 */
		onBtn: function (args)
		{
			var btn = Ext.getCmp('panel-toolstab-main-button-' + args.name);

			if (!btn.disabled)
			{
				if (btn.enableToggle)
				{
					btn.toggle();
				}

				btn.fireEvent('click');
			}
		}
	}
);