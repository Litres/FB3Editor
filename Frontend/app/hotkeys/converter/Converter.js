/**
 * Конвертер для преобразования названия клавиши.
 *
 * @example
 * Й -> Q
 * Ц -> W
 * % -> 5
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.hotkeys.converter.Converter',
	{
		/**
		 * @private
		 * @property {Object[]} Таблица соответствия клавиш.
		 */
		data: [
			{
				key: 'А',
				char: 'F'
			},
			{
				key: 'Б',
				char: ','
			},
			{
				key: 'В',
				char: 'D'
			},
			{
				key: 'Г',
				char: 'U'
			},
			{
				key: 'Д',
				char: 'L'
			},
			{
				key: 'Е',
				char: 'T'
			},
			{
				key: 'Ё',
				char: '`'
			},
			{
				key: 'Ж',
				char: ';'
			},
			{
				key: 'З',
				char: 'P'
			},
			{
				key: 'И',
				char: 'B'
			},
			{
				key: 'Й',
				char: 'Q'
			},
			{
				key: 'К',
				char: 'R'
			},
			{
				key: 'Л',
				char: 'K'
			},
			{
				key: 'М',
				char: 'V'
			},
			{
				key: 'Н',
				char: 'Y'
			},
			{
				key: 'О',
				char: 'J'
			},
			{
				key: 'П',
				char: 'G'
			},
			{
				key: 'Р',
				char: 'H'
			},
			{
				key: 'С',
				char: 'C'
			},
			{
				key: 'Т',
				char: 'N'
			},
			{
				key: 'У',
				char: 'E'
			},
			{
				key: 'Ф',
				char: 'A'
			},
			{
				key: 'Х',
				char: '['
			},
			{
				key: 'Ц',
				char: 'W'
			},
			{
				key: 'Ч',
				char: 'X'
			},
			{
				key: 'Ш',
				char: 'I'
			},
			{
				key: 'Щ',
				char: 'O'
			},
			{
				key: 'Ъ',
				char: ']'
			},
			{
				key: 'Ы',
				char: 'S'
			},
			{
				key: 'Ь',
				char: 'M'
			},
			{
				key: 'Э',
				char: '\''
			},
			{
				key: 'Ю',
				char: '.'
			},
			{
				key: 'Я',
				char: 'Z'
			},
			{
				key: '!',
				char: '1'
			},
			{
				key: '"',
				char: '2'
			},
			{
				key: '@',
				char: '2'
			},
			{
				key: '#',
				char: '3'
			},
			{
				key: '№',
				char: '3'
			},
			{
				key: '$',
				char: '4'
			},
			{
				key: ';',
				char: '4'
			},
			{
				key: '%',
				char: '5'
			},
			{
				key: '^',
				char: '6'
			},
			{
				key: ':',
				char: '6'
			},
			{
				key: '&',
				char: '7'
			},
			{
				key: '?',
				char: '7'
			},
			{
				key: '*',
				char: '8'
			},
			{
				key: '(',
				char: '9'
			},
			{
				key: ')',
				char: '0'
			},
			{
				key: '_',
				char: '-'
			},
			{
				key: '+',
				char: '='
			},
			{
				key: '{',
				char: '['
			},
			{
				key: '}',
				char: ']'
			},
			{
				key: '|',
				char: '\\'
			},
			{
				key: '<',
				char: ','
			},
			{
				key: '>',
				char: '.'
			},
			{
				key: '~',
				char: '`'
			}
		],
		
		/**
		 * Возвращает преобразованное название клавиши.
		 * @param {String} key Название клавиши.
		 * @return {String} Преобразованное название клавиши.
		 */
		getChar: function (key)
		{
			var me = this,
				data = me.data,
				convertKey = key;
			
			Ext.each(
				data,
				function (item)
				{
					if (item.key === key.toUpperCase())
					{
						convertKey = item['char'];
						
						return true;
					}
				}
			);
			
			return convertKey;
		}
	}
);