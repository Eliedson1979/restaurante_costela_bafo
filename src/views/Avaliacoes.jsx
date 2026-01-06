import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '../utils/supabase';

/* const mockReviews = [
  {
    id: 1,
    author: 'Carlos Silva',
    date: '2 de Janeiro, 2024',
    rating: 5,
    title: 'A melhor costela que já comi!',
    text: 'Simplesmente incrível! A carne desmancha na boca, o tempero é perfeito e o atendimento foi nota 10. Virei cliente fiel com certeza. Recomendo a todos que apreciam um bom churrasco.',
    likes: 25,
    dislikes: 0,
  },
  {
    id: 2,
    author: 'Mariana Oliveira',
    date: '15 de Dezembro, 2023',
    rating: 4,
    title: 'Muito saboroso, mas o lugar é cheio',
    text: 'A comida é fantástica, realmente vale a pena. O único ponto negativo é que o restaurante está sempre lotado, o que pode gerar uma pequena espera. Mas a qualidade da costela compensa.',
    likes: 18,
    dislikes: 2,
  },
  {
    id: 3,
    author: 'Ricardo Souza',
    date: '30 de Novembro, 2023',
    rating: 5,
    title: 'Experiência gastronômica!',
    text: 'Não é apenas uma refeição, é uma experiência. O ambiente é agradável, a equipe é atenciosa e a comida... ah, a comida é divina. A farofa de banana que acompanha é um show à parte.',
    likes: 32,
    dislikes: 1,
  },
]; */

const RatingSummary = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews : 0;
  const ratingDistribution = Array(5).fill(0).map((_, i) => {
      const count = reviews.filter(r => r.rating === 5 - i).length;
      return { stars: 5 - i, count, percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0 };
  });

  return (
  <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 mb-12">
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="text-center">
        <h3 className="text-5xl font-bold text-yellow-500">{averageRating.toFixed(1)}</h3>
        <div className="flex justify-center text-yellow-400 mt-2">
          {[...Array(5)].map((_, i) => <Star key={i} className={`fill-current ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-zinc-700'}`} />)}
        </div>
        <p className="text-zinc-400 mt-2">Baseado em {totalReviews} avaliações</p>
      </div>
      <div className="w-full md:w-2/3">
        <div className="space-y-2 w-full">
          {ratingDistribution.map(item => (
            <div key={item.stars} className="flex items-center gap-4">
              <span className="text-sm text-zinc-400 whitespace-nowrap">{item.stars} estrelas</span>
              <div className="w-full bg-zinc-800 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
              </div>
              <span className="text-sm font-bold text-zinc-300 w-12 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

const ReviewForm = ({ onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{ author: name, rating, title, text }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
          onReviewSubmit(data[0]);
      }

      // Reset form
      setName('');
      setTitle('');
      setText('');
      setRating(0);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 mb-12">
      <h3 className="text-2xl font-bold text-yellow-500 mb-6">Deixe sua avaliação</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
          <div>
            <label className="text-zinc-400 mb-2 block">Sua nota:</label>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={28}
                  className={`cursor-pointer transition-colors ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600 hover:text-yellow-500'}`}
                  onClick={() => setRating(index + 1)}
                />
              ))}
            </div>
          </div>
        </div>
        <input type="text" placeholder="Título da sua avaliação" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        <textarea placeholder="Escreva sua avaliação aqui..." rows="4" value={text} onChange={(e) => setText(e.target.value)} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-500"></textarea>
                {formError && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center space-x-3">
            <AlertTriangle size={20} />
            <p>{formError}</p>
          </div>
        )}
        <button type="submit" disabled={submitting} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black px-10 py-4 rounded-full font-black uppercase tracking-widest transition-all shadow-lg shadow-yellow-900/20 disabled:bg-zinc-600 disabled:cursor-not-allowed flex items-center justify-center">
                    {submitting ? <Loader2 className="animate-spin" /> : 'Enviar Avaliação'}
        </button>
      </form>
    </div>
  );
};

const ReviewCard = ({ review, onUpdateReview }) => {
    const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

    const handleLike = async () => {
    console.log(`[Like] Tentando curtir a avaliação ID: ${review.id}`);
    if (isLiking) return;
    setIsLiking(true);

    const newLikes = (review.likes || 0) + 1;

    const { data, error } = await supabase
      .from('reviews')
      .update({ likes: newLikes })
      .eq('id', review.id)
      .select();

    console.log('[Like] Resposta do Supabase:', { data, error });

    if (!error && data && data.length > 0) {
      console.log('[Like] Sucesso! Atualizando a interface com:', data[0]);
      onUpdateReview(data[0]);
    } else if (error) {
      console.error('[Like] Erro do Supabase:', error);
    }

    setIsLiking(false);
  };

    const handleDislike = async () => {
    console.log(`[Descurtida] Tentando descurtir a avaliação ID: ${review.id}`);
    if (isDisliking) return;
    setIsDisliking(true);

    const newDislikes = (review.descurtidas || 0) + 1;

    const { data, error } = await supabase
      .from('reviews')
      .update({ descurtidas: newDislikes })
      .eq('id', review.id)
      .select();

    console.log('[Descurtida] Resposta do Supabase:', { data, error });

    if (!error && data && data.length > 0) {
      console.log('[Descurtida] Sucesso! Atualizando a interface com:', data[0]);
      onUpdateReview(data[0]);
    } else if (error) {
      console.error('[Descurtida] Erro do Supabase:', error);
    }

    setIsDisliking(false);
  };

  return (
  <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 mb-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="font-bold text-lg text-zinc-100">{review.author}</p>
                <p className="text-sm text-zinc-500">{new Date(review.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      <div className="flex items-center bg-zinc-800 px-3 py-1 rounded-full">
        <span className="font-bold text-yellow-500 mr-1">{review.rating.toFixed(1)}</span>
        <Star size={16} className="text-yellow-500 fill-current" />
      </div>
    </div>
    <h4 className="font-bold text-xl my-4 text-yellow-500">{review.title}</h4>
    <p className="text-zinc-300 leading-relaxed">{review.text}</p>
    <div className="flex items-center justify-end space-x-6 mt-6 pt-4 border-t border-zinc-800">
                <button onClick={handleLike} disabled={isLiking} className="flex items-center space-x-2 text-zinc-400 hover:text-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <ThumbsUp size={18} />
            <span className="font-medium">{review.likes}</span>
        </button>
                <button onClick={handleDislike} disabled={isDisliking} className="flex items-center space-x-2 text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <ThumbsDown size={18} />
            <span className="font-medium">{review.descurtidas}</span>
        </button>
    </div>
  </div>
  );
};

const Avaliacoes = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReviews(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

    const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

    const handleUpdateReviewInList = (updatedReview) => {
    console.log('[UpdateUI] Recebido para atualização:', updatedReview);
    setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r));
  };
  return (
    <div className="pt-28 md:pt-36 text-white bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-yellow-500 mb-3">O que nossos clientes dizem</h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">A satisfação de quem prova nossa costela é o nosso maior orgulho.</p>
        </div>
        
        <RatingSummary reviews={reviews} />
        <ReviewForm onReviewSubmit={handleAddReview} />

                <div>
          {loading && (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="animate-spin text-yellow-500" size={48} />
            </div>
          )}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-6 py-4 rounded-xl flex items-center space-x-4">
              <AlertTriangle size={24} />
              <p><span className="font-bold">Ocorreu um erro:</span> {error}</p>
            </div>
          )}
          {!loading && !error && reviews.map(review => (
                        <ReviewCard key={review.id} review={review} onUpdateReview={handleUpdateReviewInList} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Avaliacoes;
