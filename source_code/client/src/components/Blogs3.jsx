import React, { useState } from "react";

const blogs = [
  {
    id: 1,
    image:
      "data:image/jpeg;base64,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",
    title: "Spicy Channay",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo .",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    image:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxQUExYUFBQXFxYYGBsbGhkZGRofIRshISEbISAhHh4fISohHyEqIB4ZIjMjJiwtMDAwHiA1OjUvOSovMC0BCgoKDw4PHBERGy8oISgvLzAvMS8vLzExLzE6Ly8xMS8tLy8tLy80Ly8vLy8vLy8xNy8tLTEvLzEvLy8tLy8vL//AABEIAJ8BPgMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAEBQMGBwIBAAj/xABBEAABAgQEAwYEAwcDBAIDAAABAhEAAyExBAUSQQZRYRMicYGRoTKxwfAHQtEUI1JicuHxFTOSQ4KywiTSFlOT/8QAGgEAAgMBAQAAAAAAAAAAAAAAAwQAAQIFBv/EADARAAICAQMCAwcEAgMAAAAAAAECABEDEiExBEEiUWETMnGBkaHRFEKx8MHhBVLx/9oADAMBAAIRAxEAPwDmdxAtKkplhOpVCllENzJJLl9yLxxLSqdNK+1SjQGU6Xcs7DYAUrUxVRnZVMQl0SgpwpaUgKI6lqk2rEmLxCAkSpClqJA1KLiu7tv06R5z9ORQr+9/SesGRdyI3x2Mlyw/emzVA6Wu3Nhv7C2zwMOGk9jrmFQmvrWXS4YWBFg5bkWHKPcnxMmWyNDKDAzPzEO9/M+w2hjn81KpPZpmKKCrUXooilFFhfpE1FCFXb1/1LK6uZTEqZiFNvQn9LxNjsmxE2YdIQaaiyreNLvyiE4+UEkFIpRKWel3JuS/yESYHOiATq8qw4Q43UfWKgqfCT9IBh5c/DzUzFAjSQXcHyPiHEaUjNkBCdIQlKgCnQhutXfzeKcrNJSlJ1Fg3wkOH+t4gn4mWPgWrT/CTTygOdGygahR9JvEqpdGx6xvi8aAToURvQs31hCrE95q3iL9pFW3jvAyNSgTZ/WNJiCDeR8pYgCOcowyFqCg55Ox+cW3CSQgjbTVR2SGvWlL+UA5Vh9JdVGcMPpBycIcTMGFSSnX3py3oiUNv6l2HQkxzyTlygdhDuwxpvLJwXNRLlqxCzqmYmaVJlhnSknuDqdOmvWIPxWz8SMP2KC0yYKsapTv6mkPF5Zh8Kk4pWrTKR3UuCLMG6mw238MH4ozpWJxEycr8xtyaw8hSO30mJiNTAD0E8/1GRS3hJPx/j5QSWXg6SBAMkQyyzC6+8o6JafiWfkBuo8o6JYKLMVCljQh+WYVcxWlAdrmwSOZNgIcIx6UDTIAmrFDMUP3af6ReYfalxAhdadAT2cn/wDXuvrNO/8ATbm9gTKSBCWTMzbDiPY8CpudzIlSStWuapUxXNVh/Sn4U+QfrE2mPJ00JBJIAFyYUYjiKSAWUVHkAfrAajFxqqYBAc7MpaaFaR4kQmwkmdiyWmdmkbB7ezwyHA6tLrmK5JLU8+X1geTPiQ0xhBhdhYnkzP5IsrUeSQ8LZvEswk6EAAfxOfVrQ0l8IJZkrBZy7VDPceQ33fpBM/IZUoJmTCQC4Ue8qvSlSzXa94r9Vj4G82OnaraVv/XcQFEEJfqk094m/wBaxO2nayXhrluPw6k98FGhL6VAp1VoUl7VA5xZsLlctcvtEpaWzglNyW7uqpIFgaB+sYfqGX9spMaEbmr/ALxKTl3FMwTAmcBpJuzEfRotsqeFRFmOT4dSAJhSFVo5cfzO7cz5bxScBmU2SogKK0pLbkKY7HZxBcGcZBsKmM3TlTsZe8RhErDKSDy5jwIqPKI5UydJLpJmJ/hUe95GyvA16xJkeYIxCTpooXSbjr1EMFYfaCeogNx4WkuWZoiaGdiKEEMQeRFxDhCRpBa27RU8Zl7nUHSoWUL+B5joYMynPVIPZTqHZWx6j6i46isOYup/a31/MVy9KOV+n4lmCAtCkkBQIYg1BFqg3j0SwQ928fbnE+HSGcbgVFunlHwV5Q5E5AkM+4Pl/iOUKNXteJG8/veICaEhLqFhZ+jmIeLljmeLLnx8RAqphBrWlOvn5weJe5AB+3++kc4iQ7Uo9/X6RYMoxcstUO29a/4gqXNcApDuI9EkG1dtvfweIJMoJJYk9EpDDzKh9YlyTKs1ywSUpXKVq7xvUBrEU6+0cYOSVaValSwpzQB6OPR/rFk4hlpHaI7JZlgJVqSKJNRUMCAVN6RHJytKik0YiiVOxJZgyaknlHmfbnSL5856r2QvbiVWfjZiVkE6wDUhgf0jmfmExSAooUEK1aSXrsW51p9mNSyzgMiWZ2JkolyxaSi6htrVdI5gd47kRW+LMGqYvWQEpSNISkMlKRQBI2AHKOhjwgjUy1OZ1HVkHSjXKzkuUdqnWagEhgHNGPydztWJ05WmfMXpoQkqoAHZvqRYQxysJSQCe6/eAvZiRUVbnSLbhZWFlPPkpMzSAxSe+diCkqSzVOwo9YDnLIb332H+5eF7Wh85n0rh2YpWlj5t8mq9qc9oNkcMrGoFehAUx1JPePIAPX0AcOaiLFguKJS1PMksSHvqLlrAsQLmpO0PcPJE4vLQWNGEthtcdecLZc+RKBXmM4yhJIMoAyVILJBJbkK+epgOo1eUN8LkqULSuYCmWXol1EUo7Ddrs3hFhxmNw8l1T5suXUgpDaqckCpHUUtFVzHi9eIWJWBlLKiaTFgE/wDaioTsxJJ8IpBlyizsJGyKppRvGeY5oJWlCEapim7OXV62UsflTa7E+DmL/wAGcLmTJC5qj2q1dpMUCzlrDkkCg+kLfw/4B7BRn4gmZONdSiS5IHOvreBPxU43EtKsLJV3jSYobD+EfX0g/T9Ep7bevJP4ifVdWT4Qd+/4Erv4rcY9uvsJJHZSzcfmVZ/AVA/uwzdJjvWTeO8PIK1ADeOtsBObudhCsuw+okkshNVKb2HMnlFilJoCoaQn4EbJ6nms7naw6jYCSAkH8o+Hr/OfHbkPGOZHa4hZTJSC25IA389uUJ5cl7nidHDi0ihuYzlzo8x2YJkpdVzYbn75wpxeSY1A1lSQ/wCUK9GcN7xBL4dnq/3FJSDUrWpghg7vuOggAyp/2EYOFgLYbSfB5dNxupalaUJLADmzs3g1esS47hJUlIW4U7jbpzua7Qbh0mWg/s6lmWAdU0pJSs/09GpdqVhFmudrWoAqOlNmp9iAasjOdJ2jWLQUDVLhwfl0vUUoOomjtQAM4J3Z3eLJMTNTVRSUq5uAALEhj0sS+zRVuE5KhL7VOsKSkK1D8yqUOybs8E5rn80S0vJEsqV3e8hRYV8BycXaEcuL2jm+YUXQ8o0UpJBmq7qEqYvqZTJq3kxpeKbjc+XOlzEBIUCtKnYMlNEvsxJKR6QZNz8hIkr1BIS7GjvY+5bpFcRjAlYSZZKf4AX1EWfnWrDdoZ6fDQqphgA2q+dpcuF8slLkzDi1oWpSwEuzoY6RpcgXu3R3h3mmbFYTh8MEJSn86j3QKgABNm97MxMZZNQFpJJX2i1lQlgkMGHeIarmgFPGGuW5Ti5bqCkKJZOhRdyRcAsQQxq4tuIaZdtyB8pysuBsmQlCfxJ+I8ah1S0o1qbTqKWcm5IA3oR0aEeSgqdAVpNX2py/t1ghMiYmYpKyFqNVMyiNzYsD8oYZRIlmaqaofuEuCap1K0gsDe9afWMilUqI87hQC54nSMCUjuuFCoIv5RYcj4htLxNxQTG/8v1iPDSSp5iaCjFIs/wsQLloAOHMwl2DOSokAbMAOfSvtCmPOymNPhRxUvczBgh7wqx2WBQYin3UHYwPwnnYQBJml0fkW9n2PMfLwi0apazpSoE8o6KZEcc0fKcrJiyY2oix5yvZHmysOsSZ5dB+Bf6/UeY3AtStj9+MJM0yoLSQR6XHUciIGyDMVIV+zTT3gO4rYjb5HwII5Q5gyFTpbjtFc+MMNS89/wAywFXrEMpDkliGJu1RTl90Mdy0GrmjlvpBBSNPubQ9Ep8ioqBbaPMViEJDkt5OfTfw3pHRFOVK8oruHxCps/VTS5CPK6utCwPM+mGNS4fNmlVGb+Xl/URdXQUEKMRmUrWUlTFNC4UzjlRoB4x4i7InD4cArSAVqBLoIUkgU5i7/wAQ5xn+b52/e1qM1TPoISlKWNHUDV2LAb3owWfKQaXn1kImh8N5JicdOUplJkDuqmKBAmB7J3NhagZnjTsh4Vw+FrLQ6z+dRcjol/hHh5vDxCQAwsIT5/xNIwqXmKdWyE1UfLbzgCYMeEX949l6rLnNDjyEbYmSFpKTYxm3GEzLpDidO1K3loGtXoKJ8yIqfHH4gYqaezlnsUG6UKBUQeax8g3KM/lYOYtVDQ3d/E+saPUCrH3msfRMPe+0s+J4nwznsMAVj+KdMV/4y2A/5QnxfE041TIw6B/LISW85ms+phvhsvShNVuGLBm9biOp2WpLBKda1lggB3J2SA5PlCZ6wE1U6S9CKuIxxJiAmk0AHZEuUn/xSIgVmeKmKA7WYrUfh1Fj5Chi6Ybg2WBqnqCGugAKWbjwTU7naxiy5DkMtJZEtKtQprdSgKVAPdc82sIDk61BwLMsYQAb4lCyvgaZiNHfIKjp7z3Ban8t6xrnD/BMjDLMxtKUkCv5iKVHJ7cztDbKcmlYZPaLXUByVGietQNqVjOeP/xJVMeThFFKH70wBironcDmSH8LE+LE7gHL52B2+cR6jqRqrHsOCfOPfxB/ENEkLw+GVqmVClioRzA5q+XyxCfPUtRUokk9frEtyk8wQfE1+cRaax01E5pnAEPcuwlACPiDq6J2H/d8gYCy/DhSnV8KBqV4DbzNIsWEQWc/ES5/TyDDygGd/wBojfTY/wBxnOLSojSgOo0AG5jnLsYMKAAnWaOCxNC9mpuKbE84XZvjSpRlo2+JQ+Qg3KsuCZfaqnAEd6xJhDqCKAJ+U6fTg7moVMxk/FqVoUEvsL1uVB6ffkLxLiFlUtAm1dKNIoQyQCTWHc3iDDyklejVMILqYJ9gWfwFfeAeF8Gmce1Q+rtA9jpLkgV8q84UQ14itAcbRp9xpJjWSpLJExDS0uHSWJFNmal6Xc84hORSZyxMCO4m4SQ7OXU1wwYgG7Pu0HTgpevvqCAoaZYSlWskGpPkWJHWzQoRxArUTLdkgJR8QUomh8gNv1aBoHG6yEqfDOM9mTpQXMlUTpCdTgKapBISADQM4A2pFLmYsljqUTuSefIf4i855xBKIKVIukBb1J8HoBu9/CKBOlBzodhah6Q90u4JYb+fnB5rUACMTjFAAqLBVQwDqo1TygORips2c41LmLIFLmwp5ACHuTcHmZLM2apkpKRpBDq1B3SbFt4d4PAScKvusnSn4lvrmE1DB6UszOwJjT5saWBuYMKzEWaE+m5AlCFmWjs5pUlCgpfeDtqIYNd68o+x/DctEtcyZiJlHFdVS1goKY8vCsS55mgTLTNK3WugSoKB0gEEhQYGjByDYiE2PzqXPUAuYrSkEs/hQD09IUQ5Wo71D6FW6O5gy5SRqShSJRVpQWJ1EEVLvvBOeoSZCJaFMlBdKSB3tlLe4JIAazecC5MEzZiqHUollGrch43jvEZXOUpSuy0pQrSoliH5AG5DwxZDbniBfErrR7xjhcWuVLRKSySACo94GwYu9Gp6+EQY4zBLZRufM/3g6VhlTVJ0h0pTUzSlJ21HWaAcnHK8eZusqSSJomKcju94lmp4MLilD0dbk2PPeax2nhY9tvxB8oxSZfeWjXpFAXFdiGIdv1gjBZpMROkziUaQ5KB8R+IMSzCh2pblEWAKSBqRrdm6DePs1mBU6idIS9LNEDU1jmMldQozUsBipeIl60eY3BhNxBk5Wl00WmqT9H6sPAgHaE3A+PCMSJaVBSJtKF2LOPN6esaHiMO8dLA5yp4uROJ1OP2GShxyJWshzDtpYP500ULV5t15c3G0MpTkXrX0eK7mcs4bEiaKS5tFdFbn/wBv/wCkPZcxzTkPImOlgcstHkRDMgVrHBn2b4jRKUf5TAOQBKZdRVKQNrnvK91GOs8BMqYOkV3Ns2CMHMWFFJcAMHdwGHTZzyBi3/xBSm8YYsTZ01QYtMUAHcbWpe+wJvtWvLRIYFQUkmrVP1+6QbIny1K1TkqLmml/Qlmdt45xyO52stChL1lIJBarlgavQAeVzHPUm6NyTXeJ/wASlzNUvC/uksWmrufAV0j38IzHMswWfjmKWQ5USpTKPgTUuYnzOclaisAAL/20pUeneUFOWNdw5jvhnh5eJm9mWlJKSdag2qoDJB6mA6id3M9AuNMS0oqJO0IZQYnkYfZPhcXNYypWpy1EH5+O0aflXBuAw7JWBOm8iCs0rsC0XXBYQpAEpMuWhvh01B8izeUZIDHSKP8AfpBnrNAuj8+JjmXcHTSsftRLmujXpAHNRcERpPD/AA9hZZeSlANHUgOS70Ky6vJwIajh2RrMxQKlEu6ifYRDnHE+EwiT2kxCSPyJYq9BbzaM4+jyFrc7eXpAdT13tAKuSjh2SDq0953dTH2b0gLO+IMLgE98vMIokVWrk/IePk8Z7xN+J06b3cMjsU/xmqz4bD7rGdYvELWoqUokm6iXJ8TDmPo8aGwoESbM7ckmWLjDjifjCUk6JYNJaXb/ALjufuloqKg5rHZRyjrRzhsCCnstLgje48Y+XUBXP5xJIoXgkYcrVoH5lhrU1f3eJxIBcOwGH0y0A3mHtD/Sn4R5q73lDKUYHxax2qmskhA8EU+eqI8ZOaWSLmg8THNLWbnXVKAURJiBMClmWP3ZWat4m8RLnzKj4WanP0i15UFSZaSpLkFTJUAQCoAameqhtZqGOcTk+hX70IoXNQWoSbOO7uOo6wA518o2uI8XKnLwy5hYOVk2YsBuosKAbxf8pxMvCyES5CkrWUKUtbAkX1ENYVDPyHWOpefSJASVyyTpZBQKEG1Szbhm2hX/AKgcbPKUtLlEJTRgGHxOoXVR6/SMtkZ1s7AQKOBmKEX6z7ALMsrnF1LUyi+oBL90PtqalARSFGa5lOmkolJ0ygWKgnTqO5JrzsDSLhm+IwkhKao0AdyW2qpcaiTUm5cnw6K8onLxRMqTLAQFMqYRQJJ/KkM6jU/4jCHctpv1PEaOmqupU05RMUGJLDYV9otHCuS6UqMxw6WZVHegIodlFn5+UWnE4YIVL0KdBDBZADMxUnxBPKrmPswwAUsaFHUHGo7ijKI2LP1pAcvVOwK8S0xrYaQqXKkytSSCXJ0ghksRd3UeX675/jcUufMKkO35XqQHcAE0elD4xcc54RlrlhSJqlLJBp3QwvQ3Jo1bC20RYzJTM0y0JmBNAZgQAlNGFG5e5EbxOmPk7/xA5k1qSo3md47GGYpypSzZ1EksNq2F6R9Jw5VUghLsT1/xDKXw9NlT9ExJCQWKg7KHQ862vFqkZShKEJ060qmoCC4JWVEpctUIFz9Hh586qAF3+EymMndtowyXASZchKZa2WtIUqhBUCHAfbaxF/CFFJs4SZak6O0CQlOq7ly5uzO+7gOamLHmGEWgA6ksDZKSND/wX0n5ufCFudYaVLlJABGiqlgaS6iAaiu1Cf8APOTICd+YwFoWJ5g1IM6ZplpWhH8QJDbFud4Ex2BJBMqYUEB2LM27bi/ziHh9IQFETilKnUdW7beLfWFOZY/vKImEgm73fbwiJjY5KU8TbOAtmFZWdcoj8xcdfKDMuwapYT2oJTTk5HR4G4YWNLs8NsfPJVqXM1rUASOWwB8orIxDMom8YBAb0k2RKTKxMmaUkJCnPgXDjm1fSNfWgEUjHJRXNLk0SGTGl8JY/XK7NXxI9xDHQ9SFf2bd/wCZz/8Ak8BZRkHbn4SDibK+2kLQA6mdP9QqB51T4ExWMhxoXLT3u8O6qt2Zr3JDH1jRZyIy7HSjIxy0CiVEkUox73s5D/yx2sZ0uPXacc+JCPLeWXEJ1JIFQofR/nFMUAEqlK+FQKC/np9jfoItUjFOACev3+sV/Ppb6laXBu3LmDz3hph3iwlFwkwYeeATQKcO7UsKEXPOlPKJOIOIlTyEhTJSSQWobOw879IIzfBfCpgsH36HkYr82UxJKVEE2JLjk5blHPfpxq1VNT9C5d+GWBlF9K19FKcejQ2GT4GSKiWlv41f/YxgE/OMSt9WImq8ZioCmzFGpUSepMa/T4zyAfjvGD1GQ/uP1n6CncV5dh3abKHSWAf/ABEVvNvxdkikiStZ2KyEj0D/ADEY0HiaXLcwRUVRQEESSd5a8648xuIoZolJP5ZVKdTf1JiuS0klyXPM1MezEbQXKl0jUkCnh4iCILIHpHhlxJIImWxj1UsecTqlx83zjUqC9mYcZAXmhR/IlSvTrAJszwx4flk9qoJdOkJJIox29hAs5pCYbp11ZAIRluVlSe1mulF+qia+Qc3gFePJdKAG5in3/eGebZh+0S0olvQ96lDyb3iTK8gYd6/hHFbL3b6TuBQg2iSXJUUkl1Hx84uKcwT2CUgagU6e8xez0NhR3uSXgjB5U6V91mBAo+1KRXMPnIUEKMtQmAAaQEgOA1U6TXrQ0ECYswsQmIqxoyT/AEwpDMOzNAXUwYWJL1r0HSGmLyJOgdisqSQ2kqPSgIFTfYWMIJhxMwtLQSkMSQoBv+RAfaE07N5/aNLEwFKrXY2JYRpMWRxyJtyim/8AEejhGcpaO2CZUsv3u6pTsKABzavOvpb8jwhlAyJX7sJckkAKUbBybFmDAtU7GEOWpmTADNXMKgQR3r+ENhl6m/3Cz95Oy2sywXBcs9t3jD5ix0jgczBxEckb+k80L1LE1CQxCgdTkhi7tTZ3eJE49ACwtWgHumimYOo1pf4fatYFzDGKLyqFalMVL/Kl92qdw1TaBcbh0zFKGvtFa2UQCEpDCjbOaeULgAHV2hNLFQCd4Lm2cz0oeWo1bzQ9mP1rB87ETZypIdQl6dSynSymIKQxDgvVwxa28VXiPFpQrs0rf+IgebennBeXccolJAKStYdiRT5nbpDXsXKBkG+/3gcpTgy1fsC1pBJKVAatS3ALb1hbisUJkxpUsp7MaislTgl3arV8N4rWL4pxWL7gA5JbusBzJLNR6tHWQ5jMlzlInBiSHIL7NQuQaG8V+kZQSTv5XNY8osCWFeerlkCYCE31MooFLnrFe4i4lE0hikpcOkaq9XJ5xZpmCWorUStAWhkDU3dYsVeIbpaKflGWLlTjrlFQQDqYKb/kBuHbz5GNdOuPc9wOJrKW2A4MLQEHvpV3AKA2qGsd4S4ueiYpKUoCAL1clzc+UXXLxJmqXMmSgkrQdAUHerG4r49Dzg3MMgkCWlBlpAqXAapNWIq1qbM20QdSuNvEDf8AEy2Jm2uI8DhxpSkUBYPBUvL0IWzsxvUjzjiRLEtyuiEsXABU1qDzr9iPl50nTqlUUwLlhs9nv4VgJDsbXiMigI+xCez0qQqWtIqCGILPereR6RLwrmxGJSominCg/P8AvFPkY6+tKg7fl38bcoeZLhzMxEuUkuVKAJBsLqbwSCYx7JlO3PaYfScZ1cVNlUHDxm/4lYbTNkTQKnu+im+Uw+kaWEAAAWAYRR/xUlf/ABkrF0r/APVR+aRHpGsLZ7VPM4/erzuIhNd7O+1IkMynQ89oWYbFpdlNbpyFeu3tBkxO5Lj6nbptSOhFoqxuXkEmWzE1QfhPhun3EDqwyVga0FLUqkrHkpAV7tDFJI3qxI/zBGFQ70L9HgZXylyh9nHplx2qPQIBNwYyGgvCS6j7+948CINlyyKj0+f1iSSIy+95wQoVPhHskO8cqoLufpFSQOamsRpgiYpxESyN4sSTzS1eUQzT6kx2tdCBHMuXUfWNSp5Kw6lKSkByosPH73h5j8UmUhOGln4SCs/xK3J51+UR4KQJYVONwNIPLct5UfrC3BSTNmufzV9DHO6vJqOnsJ1uixaV1Hk/xLVw7hxoejO4HvFnw8wJSklAZzqO53+Riu4fDiTLC1VILN9+cOFZtKOAmnUhCgk1Wzd4FuptYRyApdto1l2F+skOcJlrQlP/AFFKd9qUEBZkqSJiVGWKkksB3i1Xo23zitTMYFIQsh1bF7bel4sMnBzV4cr0gqDaRckvVh4U8+kUytxNrpU3DFTwQEJSGBd0AJZxQlQp4EvaAMXizKJRNUCosBUVo5S3LbceRgTKQkFRWTWiUamqa2dy0D8QdiuZLTNUmoBOimjoFBnIAEZRdRokxg7cSXE4+StSZeoIJoebb03IoxpaJ5iRLCipWpkg6mAJ3/LatAX84WYThmVLSpZma1U0qeod/XaBswxkoyijWe0SHAuCBy9veNaAW0oSR32lg7WYtzPOjLWAhbm5VVxzFT7wKc/mlTSgHd3S4JPryYeULUYftCQmu5+zD7BcKqVL1KQXZ9TkAD5N1jpacSDxcznh8jsdPHxnXDeTKWpc+agKY2Wbmj0AIN7GGeL4YQohS0kAgkpDE0DJYA1Hw8vOCcpkS5SVy5X71RoVPRJNzqIAcggb19IdyccmTKSiY0w97UUlKSG3L3qS1a2ruvkzNdg/CbTDTHb473cV5fLkylCUiULkaiGehLKdy+7eENJWFBnFTN+7I1FINzQDVtVNRzHOK5nOdykq1plF3+IsCzHUG5VDe0BSP2qYgzVoKZQcANUAm7HmWqXtARhYnWfv3jWpeI/zfG9myQpJmKcBhQuaEgEsWuP1gDJ8XNlYmWhSwohbLV+XSH57GrBoQLxKEKfSokKd1EEivQXjnE5gFT5ayaE1BIG4B9jvB8WCjsPnBZcw0mzNGzYoIBQlJ0uQpLsEqYd0MA1AY+VgwUJUVKYpa1AX+ZABvzjo4RQw6JZPf7MFGs97SNIdTBn3pevKFeZZqUyQnUUmoU1yzN4VYPyjn5sbe00wuF7QaYsziYwUP4WHqwbrEGQ5RMxEwBITp017pSENbU7s4DwQMtKwggF1kqKCVVCSl6lyKl2/l6w+4RxoJTLW6ZSXUUKKTtZx583hzDQXTBZszBqHx9Ib/oqSnsZTLUbqKaP1N26CG3BnCgw8xM2YtPaNYCzhoeqwpQkKQEp8EgUhhlkssSfvwhvpulCt4ubv0nN6jq2ZaHH3hShFQ/EqW+DX/Un6j6xcVRT/AMTVtgl/1D5KP0jo5PdMRxe8PjMoyrFuByo494eHEPb4ffyr0HrFUyyYDct63h7gF0NfG22/+IcU7QDQzUz1brs/3uY+ViNOzvb67+ERqJrWj7NtEc6YCzodqC318AI1KlZLR0hVKQsxGGnLWUiiTuLNDbD4bQkJG1IUBuFngMHYVRa2zWgZMowbIllgGuf8/fWJJOiA3K0CYifVhyH384JnhTsBQX/TpAKsG51MRQgiJJI5ioiVLKmuIZScMW6wVJwos3rGwJItw+FNvCC0YYCpgxeEoKtUHxbY+XTaDThKPR2jVSgYhzJxIAdwo38ftvOC8klBKQd2H0gHFYtK5csF+vQ+HlXxiyZbLQmUlSrfO8ee6hzW89GoAqoVmS0oQjU+jfz/AFimZvgitJUk90LIA5fdI0iZIRNSUlIIEVDiLL9IWEGjpDcyx/T3gGBtLSagRUr2XTVskXAPKL7N4slyJQQmWk0KncDarvvSnpFMmzkoEsS6lyVHl0Zr9Xg+RgUYiYEixYH6tB33YE8TJUFd4Li8wlzv3oK0KUauolXWvKgpWAcnwM0z0TDKKwounWCQdhe+zeUM5+WT8KvtcOT2gKhQaqAVdJBBDDf9Ify8TMKkzUlKyoDUQKPY6WAZjY+EW+VUS1PP2hUBagRxEOd4GbKWZqFOoVIApWlAw0n+14Vz8TKUkifLIm3cOCkO+9D+hh/xOpuyMtSgjQBqr32YgqfwrFazVBmOQ8wi4Dd279TQRrpzYF/WTNekkfSTYDPZUtalKk9oT+QHQkCwDJf7ES5jxlMmHShHZSwzoDHUz3J26QuweGJST2aikAnUxFBdoMVw7M0CYpISmve1MVXIABuegeghjTjskiKMzEAXX2jxfEnay9KUJ127o0kl3ZQTRnrYwPPzNiolA7UpYhLaXO5NHozC3nWK7LyiYpRCZanuO6ah2+dPGDV4WdKlakzE2cpJBPgARU+FoCcSXQP1hEyMdyOO4jDtEpBnKEokflNfPq3IQDj8zXMSA5dTMA4DDdreftEAlyzLStQUqYSe4LdHFC9rQyw6lFH7pBEwkJJYG996FxQNtXrWkLv3hgSdv9xfhsKt2SQp+YHm7084kynCtOBEoLUg6tKqpSatqc1NixPi8Gfs6pZC1soAalAKHdGwNCAoli3LxgnLMYEySlABJClFQvY1Pua9GizkYAkTPs1Joxlgpk+elU1E6ZMn0WruNoIHdSn8rHvMBcM9YAzORMdSpmsLUXC/+mU/nJcagoFgARyvF64CylaJCVlQKVjX3GqWYp5gpq4G+8ccW4KR2epBAqzamAdy7c96xs49tRiPt9LFFmVSs1mMdEwpJBTqrqIPW/WnWLh+HmCcrmTR8RASOdGBbmA0BYXLpUxIcpZKlAFgCau2oXFvDzgnE5snDK7NKQoaakKIIfkQzbRe1bCZdz5kmbDOxQ0hJua/X0g+XMoG3jNOFceibi0zAFBPdQhBUwSkMEu17OzkVi+y5pEwywCAFsD0v/aD48uok/KKOlAD5xouM/8Axin6cIE81E+iVD5qEaAoxkP45Y7/AGpX8r/8i/yQPWGX4qDxe9flczvATBFiy8DyPMu9t4qeXqa+xiy4RTJBFCOsMqYEx4ZIBINaP7W+cDolAfmDEPYiCMPOC0gEMoi39zEWIRp2cbeHlBZmKZUgW6Ugjsa9IKw0lIDchTp0gqRLDGn305wGoWCycBziWboQEvz01O5t84YSMKVUcffjb+0GS8GAaj76RKkiKdhCdS2KgkGg3pYNAsopKQyV3Zikgg7u/wA4sc6XTSN/GBSCFWcff36xKlRcJDB4kw6QaDxEHiVqBDCm0eHCAp0lw+4LHyNWpTaNSrkEtP8Ab1vB0uR73+tY6RIrvcf4L/fhBAUPKNVKmeYkAS6CoIZ4tOQDtcPZwKCE/EKwkzUJAqxe93P1bygvg7MUy5BSp3US336+kea6lCAQexnokYsgI8paMAgdiGNUuPQt9IoXEMwpmrJPUeNBF2yHFBaVhNtRNerH5vFbzLLyuaSHoXflW8LYiA1mWNiZVEzRqUAXFdJa/kfrD7AYwyEki+3jEOX5Glc9STNMtCQValAOQ9jW5rD/AIqy0JQJkrvAkhdA+ogOaWAYv1IhvIA1VxKR1DUe8VHEz1FIl2WQC4dgWdusMMRhSgplArMoIFXSwLsX3NQRvUwLLmGWnWUmpYVs9npSI5WKWgErUex/6irb0uK1Ip/M8LFSTt/6Y8DQu4Pm6XQoKUUkHuuaEWsN7+sKctwylKCAW1KArzJs258IlzDGCcskABIYJDDZn33NfOPsvlLUolOlJQzq5F7t4/KGkUqlGLO4LahLvkGQV1IQtnudTF0gKA2AfV4E3NIdr4aSoDtSOzlpo5Pds7k1antDLhifplplgqWQO8SCK0oARDVc5K3R3kk2Chy+n9oMuMadzc5WXMxbYRDI4elGVQsCKEmp5KIZ08/ulLzbgGYtSVIIUWYpVSoJcAsxPjUxrSJSUodQD7+J/uwgdEq7FgSovycksOd/SN+zG3Y1MLnYesyeRkq5Woz5dS2kMXL0IPI0pQ22hVj8WsEpRJ0pPRzTrU/pGzdmCClagtTO7W8HL7xXJGVBU/UGOkgq1NpA5AEVJqHNoCcYBEdXrWIojiUjKMFNWlKzJUJdWmGqd6lNVbmrQQnDk90ml1kJZwD8t+ojUjgJKQxkoSWqQhIHmWiq43DETj2B7qbWYn5Rb4ACDMjrS6lajbh5JTLBCNAuA6iSWvVgDa1oJmyELDFAcbHcl/YVhTlmYzVggudiNI1D2pUEw0xk5MkhIDkpBKgNR+/Ac4Krgr6RNlNxJjslSCSlJ0IFUpL15khvDfxih4hKpyyoIABPdLMSLB40XGz1LSUL/dpd7uo9QBUxNlOTStLpmEJUW7zD/ix92gbbmlhF2FtKhwxiEyZ0lRoO0SFcgHFfv/GrZC5K1KJJKleVTCJOSSxMlKmstIV3lE+j8xaLgZSUKBDAKo3X+7QbpkI5gc7A8SQx+dfxOzTt8Yti6Ukt4Duj2S/nG6cW5oMPhpkx2LaU+J38g6vKPzFiZxmLUv8AiLjw29mhzlgPKBGyk+e0lwZYxZMAvuj18IrGGTWLJl6rP/mDrBGOahibFq/fj9vB37S24+7cuUD4dRISFGnnVvD59IkmJKTYF9rNBZmDyJalGotte8M8PLYAfTaB1YRQe9oZ5dLKgHtGZqHyJNH58o6lSzqJfaJkSyH7xY2DCnP6GOkAhL/pFSQObJcqLQLMlNWGq0ODA601iCSL8UsS09oQSAKsHO233SJZBRMQFJLpUHB6QTqqU89oiLCgYDpGpU5XUexH6xCU2qQ1r8rEbxzMmEV+zEikUt1+/KLlGVfi9BCgoDuqS27v1+nnCHL0rCSlQIL93mIu+ZYPtJKkD43cOW7wdvWo84qxQozQVliwcGhpS144/W4yrGhzvOz0eYFNzxH3DqFlCljzaOM4x2lJSmilM53pWDsBiJSJJHaAVJVYDYC+3XrFZzYKVMNdXVvRmjkKhL7iOBwd5yvMXnSmbUxBJSDtWh3a3WLJlqySlEtaVIKVOVfES51KJFGc2bbk0VTCZa3fU4qK7v0h9gkpRp7NYBNCVH2Snox+xDLg6KSBZlLR7xHlso4ZTqSlqjnQ7DfeMwnStRuSAqlK+YdoueNwJUlRJUXoncF6lzFTxuSTpdjS1Rb6xOmIGxNGabYc3BZSNNGB9afpFo4fwJStKnckiwLc2s0G5Xw0CAgpdRBJUQSAQH8AYsmWZQoI00SXcM1+Xt7w0wuKNkqWvLVApZKWYuWLP4ne3sIZAhqkPv0f5bQh/aRKCZbFgCxNlKGxO16bR3hsehCEjvKqVF1FRD8zuPi9IKHA2MUKk8RpOWFJNQQzg7bMfX5Qi4kw81WGWmQvStSgCpwKP3iH8twaU5GbEZvL0u1BZNudfCI0LXOSCkJAc91mbq5u8DZweNzNaDW/EOy8FMpL99QSxUGGpg48nMSy8MminUAKs3K3V/GFo7WWyEgs4BH8I5g+sGSgqpKwxG45czakWrDipbCt7kOa4lICkdoUqIqC58nALXtAeWYN0tQBwS42d/VwI6m5Ue0StBQUq1awQ4LH5wLjlapmiXLDEd5lKDkU+w0ZJN2wlgCqEbHFICiEJCg3eUSGF22q52hCMYVzT2iJg/mSQ3ny6dIZYZLyC1C716WDi9eUfSMFNepKi7gqs21IjFjUsULn0qWVqdT6U/C5B8f0bwgyXhJTJ1KSSC7ggGhJHX1iROG2CmG45sbv5w1wuWpopQB3r91giYtR3EGz1F0vDCaohIIAo+3zhTxPJmylIIUrsnAv8J2ry5ci3MRdpMpKQyQAIrf4gZtLkYZettS0kJBr4qbp82g5xBVMGrFmAEzX8VOIZ0yXKkrSwIPeFl8z0NgU7VNiIzdMablOKlZjhjImd1YqOaVbEdOcZ7mWXzJE1UqYGUkt49R4xrC3IPMmTtXE4wv1h7hiaEff3+sJcHyPOHOFDM7O32YaWBMfYJyaMaUct+sM5atXN+gJ9YS4aazGtNoZ9o7Ag2ejD73gszHAFK0gvAyCHHvAstyesNcOkBL7xmanU5TR0pDovcXFxEExRKq+0TrNAIqSQVCdL1AZ2e25HWBsQaxNNLQJNUGDvUxYlT5Z3dq3+UdlXOh5RDLUHG20dF3c1v6D7eNSSE1Nbff94mlggkOWH3ttHBNXvUwMMzQpekpUlTlnba/wkxRYDmVCuzvyMQYHHJWpTJdaABrKa1KgwJD/AJX5VEFSFBQSoVCgDycGPcTNIcgOWoOd6RCe8glL/E7DBUhE0M6ZgF7hQLhrGoSfIwo4fkzFSklSqD4S+1aD3pF1xWV9skDFJSpNFpCSobEVY8jbqYHxOFCRpSNKRQAe3zgDYRkIvYQy5NAIHMqEzGTVT+wmHSCQJbFhyDnd+fOkNv8A8UmhnlGI8dgEzKG+x5H6g2MXPgLiTtCMLiKzB3UKvqo+lR5tZW4vWpA+IKaHEIrlhfeKMpy6dLBISoACoNm8IPVlZmK1qQCpQoC4DC27n+8aKrCgpIAvCuXkipayUFxSi1rUKcgolvKF36fxaptc21RVluXTJKWJS2oMKWND1s5rzitZxn6pc2dLXpSkLuHBINdr0ZjGlTpFA6Rqaz06t7tCzH5TLXMSQhOtJBBIBYhquYHkxmqBmSxbcbRbw5iFTMOk4ju1dOoOWcBPn42fpBk5ASl5RSwNTSgHOlSY+RJDkKfvGjbkfK8GYTKNNQrkQQ/kC8ULOwEJsOTBsHIUsEFID7lIBPlybeJRliUd51d5qPRLGhHKGyUBQcFurVhfi8ckL7IBTtqFmIf+/jaNnGoG8yHJNCMgAUijOxNoUcQZkiSkBUvUhVFGjDlAs3MldoUjZJYXY2BJoTV6D2hPmuPnkFK9GliT3QbO5rGcmS1IEgxGOBm+oo7MdwpPdAL7MQ9OcGYeW3eEslzdmoD7E/SEeV4OYsha1FRFgSfR3hl+2hK9DKoN1FvmdoiMatpplrYScBcyaNB7iCoMwZX6QT2oqACSCbH7p0gb9qSCAglKRsPzeMOcmwXdClXNW5QZFJMExAk2CwhDKUEv0g4R9EGMxSZaVLWWCQ5o8NgBRAbkyPM8eiRLVMmFkp9SdgOpj868c8TLxk5Sn7gLAC1LAdB7lzDD8RON5mKmGWh0y0khvf1IufIRS0RkeI32hD4RQ57/AIhOV49ciYmYg1Sa9RyMaFnOGl5hhkzZf+6kU5nmk9Rt/eM2JhvwxmypEy/cUaj6xnKh95eRKRux4gUiUUqYioo0PsOUgFXOnL0hpxLl6Vf/ACEDkFC3Kv6wswzaQG6+t4PhcMLmHXSYZgySQr1N9/v0hnKmEEjkwPjv1hahRoxqG/T9IIwqyXTy33PvBxBz/9k=",
    title: "Chiken Karhai",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo .",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    image:
      "https://media.istockphoto.com/id/1454649439/photo/kadhi-samosa-chaat.webp?b=1&s=170667a&w=0&k=20&c=7TWSZJPfi5Cz8YuGG554RHbrWKsuz9Ihf-FCvt7_TcQ=",
    title: "Smosa Currey",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo ",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 4,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpJivCCXW_14iTjVaacn0ZXVVKG7EMv1Oteg&usqp=CAU",
    title: "Dosa",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo gravida vestibulum.",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 5,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0_EV4mk8uZ3qdd95MN7XI8hsdvg0fXUAPFQ&usqp=CAU",
    title: "Biryani",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo gravida vestibulum.",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 6,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRglZyNlWAIUDRBzoPMQa05oURY_eXO0Cbmfg&usqp=CAU",
    title: "Dall Makhni",
    total: "100$",
    off: "20%",
    afterOff: "80$",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et fringilla velit. Duis in sapien eget leo gravida vestibulum.",
    imageUrl: "https://via.placeholder.com/300",
  },

  // Add more blog objects here
];
export default function Blogs3() {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionWordsLimit = 20;

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const renderDescription = (blog) => {
    if (
      showFullDescription ||
      blog.description.split(" ").length <= descriptionWordsLimit
    ) {
      return blog.description;
    } else {
      const words = blog.description
        .split(" ")
        .slice(0, descriptionWordsLimit)
        .join(" ");
      return `${words} ...`;
    }
  };

  return (
    <div>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog.id}
              className="card"
              style={{ width: "18rem", margin: "10px" }}
            >
              {blog.imageUrl && (
                <img
                  src={blog.image}
                  className="card-img-top"
                  alt={blog.title}
                  style={{
                    objectFit: "cover",
                    maxWidth: "300px",
                    maxHeight: "200px",
                    minWidth: "200px",
                    minHeight: "100px",
                    width: "100%",
                    height: "100%",
                  }}
                />
              )}

              <div className="card-body">
                <div style={{ display: "inline-block" }}>
                  <h5
                    className="card-text"
                    style={{ color: "gray", fontSize: "16px" }}
                  >
                    {blog.title}{" "}
                    <span
                      style={{
                        right: "0",
                        position: "absolute",
                        paddingRight: "10px",
                        fontSize: "12px",
                        color: "skyblue",
                      }}
                    >
                      {blog.off}
                    </span>
                  </h5>
                  <p
                    style={{
                      display: "inline",
                      right: "0",
                      position: "absolute",
                      paddingRight: "10px",
                      marginTop: "-1rem",
                    }}
                  >
                    {blog.afterOff}{" "}
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#7e5888",
                        fontSize: "12px",
                      }}
                    >
                      {blog.total}
                    </span>
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "15px",
                }}
              >
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  style={{ background: "#7e5888" }}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs available</p>
        )}
      </div>
    </div>
  );
}
